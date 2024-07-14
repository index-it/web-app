import {IxItem} from "@/lib/models/index/IxItem";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {item_qk, items_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  item_id: string;
  completed: boolean;
};

type useEditItemMutationProps = {
  onSuccess?: (data: IxItem, variables: MutationVariables, context: unknown) => unknown;
  onError?: (error: Error, variables: MutationVariables, context: unknown) => unknown;
};

export const useEditItemMutation = ({ onSuccess = () => {}, onError = () => {} }: useEditItemMutationProps = {}) => {
  const ixApiClient = useIxApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      const { list_id, item_id, completed } = params;
      return ixApiClient.set_item_completion(list_id, item_id, completed);
    },
    onError: (error, variables, context) => onError(error, variables, context),
    onSuccess: (data, variables, context) => {
      const {list_id} = variables;

      queryClient.setQueryData(items_qk(list_id), (old: IxItem[]) =>
        old.map((item) => item.id === data.id ? data : item)
      );
      queryClient.setQueryData(item_qk(data.list_id, data.id), data);

      onSuccess(data, variables, context);
    },
  });
};
