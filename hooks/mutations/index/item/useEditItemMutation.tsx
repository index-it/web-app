import {IxItem} from "@/lib/models/index/IxItem";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {item_qk, items_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  item_id: string;
  name: string;
  category_id?: string | null;
  link?: string | null;
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
      const { list_id, item_id, name, category_id = null, link = null } = params;
      return ixApiClient.edit_item(list_id, item_id, name, category_id, link);
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
