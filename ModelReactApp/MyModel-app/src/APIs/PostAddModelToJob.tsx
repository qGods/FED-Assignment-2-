import type { JobModelDto } from "../Interface/JobInterface";
import { useMutation, useQueryClient } from "react-query";
import { MakeRequest } from "./Utilities";

export const registerAJob = async (data: JobModelDto) => 
{
  return await MakeRequest(
  {
    url: `Jobs/${data.jobId}/model/${data.modelId}`,
    method: "POST",
    data: data,
  });
};



export const UseAddedModel = () => 
{
  const queryClient = useQueryClient();
  return useMutation(registerAJob, 
  {
    onSuccess: () => 
    {
      console.log("The model has been added to the job successfully");
    },
    onError: (error) => {
      console.log((error as any).message);
    },
    onSettled: () => {
      queryClient.invalidateQueries("jobsKey");
    },
  });
};
