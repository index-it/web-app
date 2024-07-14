import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {IxItem} from "@/lib/models/index/IxItem";
import {item_qk, items_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  name: string;
  category_id?: string;
  link?: string;
};

type useCreateItemMutationProps = {
  onSuccess?: (data: IxItem, variables: MutationVariables, context: unknown) => unknown;
  onError?: (error: Error, variables: MutationVariables, context: unknown) => unknown;
};

export const useCreateItemMutation = ({ onSuccess = () => {}, onError = () => {} }: useCreateItemMutationProps = {}) => {
  const ixApiClient = useIxApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      const { list_id, name, category_id = null, link = null } = params;
      return ixApiClient.create_item(list_id, name, category_id, link);
    },
    onError: (error, variables, context) => onError(error, variables, context),
    onSuccess: (data, variables, context) => {
      const {list_id} = variables;

      queryClient.setQueryData(items_qk(list_id), (old: IxItem[] = []) => [...old, data]);
      queryClient.setQueryData(item_qk(data.list_id, data.id), data);

      onSuccess(data, variables, context);
    },
  });
};
