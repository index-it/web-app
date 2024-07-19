import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {IxItemContent} from "@/lib/models/index/IxItemContent";
import {item_content_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  item_id: string;
  content: string;
};

type useEditItemContentMutationProps = {
  onSuccess?: (data: IxItemContent, variables: MutationVariables, context: unknown) => unknown;
  onError?: (error: Error, variables: MutationVariables, context: unknown) => unknown;
};

export const useEditItemContentMutation = ({ onSuccess = () => {}, onError = () => {} }: useEditItemContentMutationProps = {}) => {
  const ixApiClient = useIxApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      const { list_id, item_id, content } = params;
      return ixApiClient.edit_item_content(list_id, item_id, content);
    },
    onError: (error, variables, context) => onError(error, variables, context),
    onSuccess: (data, variables, context) => {
      const {list_id, item_id} = variables;

      queryClient.setQueryData(item_content_qk(list_id, item_id), data);

      onSuccess(data, variables, context);
    },
  });
};
