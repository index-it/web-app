import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {categories_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  category_id: string;
}

type useDeleteCategoryMutationProps = {
  onSuccess?: ((data: void, variables: MutationVariables, context: unknown) => unknown) | undefined;
  onError?: ((error: Error, variables: MutationVariables, context: unknown) => unknown) | undefined;
}

export const useDeleteCategoryMutation = ({ onSuccess = () => {}, onError = () => {} }: useDeleteCategoryMutationProps = {}) => {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      return ixApiClient.delete_category(params.list_id, params.category_id);
    },
    onError: (error, variables, context) => {
      onError(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(categories_qk(variables.list_id), (old: IxCategory[]) =>
        old.filter((category) => category.id !== variables.category_id)
      );

      onSuccess(data, variables, context)
    },
  })
}