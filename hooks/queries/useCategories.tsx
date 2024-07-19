import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {categories_qk} from "@/lib/query/query-keys";

export function useCategories({ list_id }: { list_id: string }) {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: categories_qk(list_id),
    queryFn: () => ixApiClient.get_categories(list_id)
  })
}