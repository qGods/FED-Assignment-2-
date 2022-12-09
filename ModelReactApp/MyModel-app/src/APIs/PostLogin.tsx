import { useMutation } from "react-query";
import { request } from "../Utilities";
import JwtParser from "../Parsejwt";
import useAuth from "../../Authentication/useAuthentication";
import { useNavigate } from "react-router-dom";
import type { AccountLoginDto } from "../../Interface/AccountInterface";


export const login = async (data: AccountLoginDto) => 
{
  localStorage.setItem("Username", data.email);
  localStorage.setItem("Password", data.password);
  const response = await request({
    url: `Account/Login`,
    method: "POST",
    data: data,
  });

  return response;
};

export const useLogin = () => 
{
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  return useMutation(login, 
    {
    onSuccess: (account) => 
    {
      const accessToken = account.data.jwt;
      const role = JwtParser(account.data.jwt)[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];
      localStorage.setItem("token", account.data.jwt);
      console.log(role);
      localStorage.setItem("role", role);

      const user = localStorage.getItem("Username");
      const pwd = localStorage.getItem("Password");

      setAuth([user, pwd, role, accessToken]);
      console.log(user + " has logged in");
    },
    onError: (error) => {
      console.log("Log In failed, try again");
      console.log((error as any).message);
    },
    onSettled: () => {
      const role = localStorage.getItem("role");
      navigate("/" + role);
    },
  });
};