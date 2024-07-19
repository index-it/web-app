import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxList} from "@/lib/models/index/IxList";
import {list_qk, lists_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  name: string;
  icon: string;
  color: string;
  public: boolean;
}

type useCreateListMutationProps = {
  onSuccess?: ((data: IxList, variables: MutationVariables, context: unknown) => unknown) | undefined;
  onError?: ((error: Error, variables: MutationVariables, context: unknown) => unknown) | undefined;
}

export const useCreateListMutation = ({ onSuccess = () => {}, onError = () => {} }: useCreateListMutationProps = {}) => {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      return ixApiClient.create_list(params.name, params.icon, params.color, params.public);
    },
    onError: (error, variables, context) => {
      onError(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(lists_qk, (old: IxList[]) => [...old, data]);
      queryClient.setQueryData(list_qk(data.id), data);
      onSuccess(data, variables, context)
    },
  })
}