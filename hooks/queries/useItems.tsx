import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {items_qk} from "@/lib/query/query-keys";

export function useItems({ list_id, completed }: { list_id: string, completed: boolean | undefined }) {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: items_qk(list_id),
    queryFn: () => ixApiClient.get_items(list_id, completed)
  })
}