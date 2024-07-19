import {IxItem} from "@/lib/models/index/IxItem";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {item_qk, items_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  item_id: string;
  completed: boolean;
};

type useSetItemCompletionMutationProps = {
  onSuccess?: (data: IxItem, variables: MutationVariables, context: unknown) => unknown;
  onError?: (error: Error, variables: MutationVariables, context: unknown) => unknown;
};

export const useSetItemCompletionMutation = ({ onSuccess = () => {}, onError = () => {} }: useSetItemCompletionMutationProps = {}) => {
  const ixApiClient = useIxApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: MutationVariables) => {
      const { list_id, item_id, completed } = params;

      return ixApiClient.set_item_completion(list_id, item_id, completed);
    },
    onMutate: async (params) => {
      const { list_id, item_id, completed } = params;

      // cancel any outgoing refetches - so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: items_qk(list_id) })
      await queryClient.cancelQueries({ queryKey: item_qk(list_id, item_id) })

      const previousItem: IxItem | undefined = queryClient.getQueryData(item_qk(list_id, item_id))

      if (previousItem != undefined) {
        const newItem = structuredClone(previousItem)
        queryClient.setQueryData(items_qk(list_id), (old: IxItem[] | undefined) =>
          (old ?? []).map((item) => item.id == item_id ? newItem : item)
        );

        queryClient.setQueryData(item_qk(list_id, item_id), newItem)
      }

      return { previousItem };
    },
    onError: (error, variables, context) => {
      console.error(error)

      if (context?.previousItem != undefined) {
        queryClient.setQueryData(items_qk(variables.list_id), (old: IxItem[]) =>
          old.map((item) => item.id === variables.item_id ? context.previousItem : item)
        );
        queryClient.setQueryData(item_qk(variables.list_id, variables.item_id), context.previousItem);
      }

      onError(error, variables, context)
    },
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
