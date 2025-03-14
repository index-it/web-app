import {IxCategory} from "@/lib/models/index/IxCategory";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categories_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  category_id: string;
  name: string;
  color: string;
}

type useEditCategoryMutationProps = {
  onSuccess?: ((data: IxCategory, variables: MutationVariables, context: unknown) => unknown) | undefined;
  onError?: ((error: Error, variables: MutationVariables, context: unknown) => unknown) | undefined;
}

export const useEditCategoryMutation = ({ onSuccess = () => {}, onError = () => {} }: useEditCategoryMutationProps = {}) => {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      return ixApiClient.edit_category(params.list_id, params.category_id, params.name, params.color);
    },
    onError: (error, variables, context) => {
      onError(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(categories_qk(data.list_id), (old: IxCategory[]) =>
        old.map((category) => category.id === data.id ? data : category)
      );
      onSuccess(data, variables, context)
    },
  })
}