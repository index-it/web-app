import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {item_content_qk} from "@/lib/query/query-keys";

export function useItemContent({ list_id, item_id }: { list_id: string, item_id: string }) {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: item_content_qk(list_id, item_id),
    queryFn: () => ixApiClient.get_item_content(list_id, item_id)
  })
}