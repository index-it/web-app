import {IxList} from "@/lib/models/index/IxList";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {IxCategory} from "@/lib/models/index/IxCategory";
import {categories_qk} from "@/lib/query/query-keys";

type MutationVariables = {
  list_id: string;
  name: string;
  color: string;
}

type useCreateCategoryMutationProps = {
  onSuccess?: ((data: IxCategory, variables: MutationVariables, context: unknown) => unknown) | undefined;
  onError?: ((error: Error, variables: MutationVariables, context: unknown) => unknown) | undefined;
}

export const useCreateCategoryMutation = ({ onSuccess = () => {}, onError = () => {} }: useCreateCategoryMutationProps = {}) => {
  const ixApiClient = useIxApiClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: MutationVariables) => {
      return ixApiClient.create_category(params.list_id, params.name, params.color);
    },
    onError: (error, variables, context) => {
      onError(error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(categories_qk(data.list_id), (old: IxList[]) => [...old, data]);
      onSuccess(data, variables, context)
    },
  })
}