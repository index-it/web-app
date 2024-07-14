import {IxItem} from "@/lib/models/index/IxItem";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {item_qk, items_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  item_id: string;
};

type useEditItemMutationProps = {
  onSuccess?: (data: void, variables: MutationVariables, context: unknown) => unknown;
  onError?: (error: Error, variables: MutationVariables, context: unknown) => unknown;
};

export const useEditItemMutation = ({ onSuccess = () => {}, onError = () => {} }: useEditItemMutationProps = {}) => {
  const ixApiClient = useIxApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      const { list_id, item_id } = params;
      return ixApiClient.delete_item(list_id, item_id);
    },
    onError: (error, variables, context) => onError(error, variables, context),
    onSuccess: (data, variables, context) => {
      const {list_id, item_id } = variables;

      queryClient.setQueryData(items_qk(list_id), (old: IxItem[]) =>
        old.filter((item) => item.id !== item_id )
      );
      queryClient.invalidateQueries({ queryKey: item_qk(list_id, item_id) });

      onSuccess(data, variables, context);
    },
  });
};