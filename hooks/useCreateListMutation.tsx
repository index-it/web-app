import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIxApiClient } from "./useIxApiClient";
import { IxList } from "@/lib/models/index/IxList";
import { IxApiError } from "@/lib/models/index/core/IxApiError";
import { IxApiErrorResponse } from "@/lib/services/IxApiErrorResponse";
import { redirectToLogin } from "@/lib/utils";

type useCreateListMutationProps = {
  onSuccess?: ((data: IxList, variables: {
    name: string;
    icon: string;
    color: string;
    public: boolean;
  }, context: unknown) => unknown) | undefined;
  onError?: ((error: Error, variables: {
    name: string;
    icon: string;
    color: string;
    public: boolean;
  }, context: unknown) => unknown) | undefined;

}

export const useCreateListMutation = ({ onSuccess, onError }: useCreateListMutationProps) => {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { name: string; icon: string; color: string; public: boolean }) => {
      return ixApiClient.createList(params.name, params.icon, params.color, params.public);;
    },
    onError: (error, variables, context) => {
      if (error instanceof IxApiError && error.ixApiErrorResponse == IxApiErrorResponse.NOT_AUTHENTICATED) {
        redirectToLogin()
      } else {
        if (onError) {
          onError(error, variables, context)
        }
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(['lists'], (old: IxList[]) => [...old, data]);
      if (onSuccess) {
        onSuccess(data, variables, context)
      }
    },
  })
}