import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxList} from "@/lib/models/index/IxList";
import {list_qk, lists_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
}

type useCreateListMutationProps = {
  onSuccess?: ((data: void, variables: MutationVariables, context: unknown) => unknown) | undefined;
  onError?: ((error: Error, variables: MutationVariables, context: unknown) => unknown) | undefined;
}

export const useDeleteListMutation = ({ onSuccess = () => {}, onError = () => {} }: useCreateListMutationProps = {}) => {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      return ixApiClient.delete_list(params.list_id);
    },
    onError: (error, variables, context) => {
      onError(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(lists_qk, (old: IxList[]) =>
        old.filter((list) => list.id !== variables.list_id)
      );
      queryClient.invalidateQueries({ queryKey: list_qk(variables.list_id) });

      onSuccess(data, variables, context)
    },
  })
}