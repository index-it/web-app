import {useIxApiClient} from "@/hooks/useIxApiClient";
import {useQuery} from "@tanstack/react-query";
import {item_qk, items_qk} from "@/lib/query/query-keys";

export function useItem({ list_id, item_id }: { list_id: string, item_id: string }) {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: item_qk(list_id, item_id),
    queryFn: () => ixApiClient.get_item(list_id, item_id)
  })
}