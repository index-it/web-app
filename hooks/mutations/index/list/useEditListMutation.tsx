import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxList} from "@/lib/models/index/IxList";

type MutationVariables = {
  list_id: string;
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
      return ixApiClient.edit_list(params.list_id, params.name, params.icon, params.color, params.public);
    },
    onError: (error, variables, context) => {
      onError(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(lists_qk, (old: IxList[]) =>
        old.map((list) => list.id === data.id ? data : list)
      );
      queryClient.setQueryData(list_qk(data.id), data);

      onSuccess(data, variables, context)
    },
  })
}