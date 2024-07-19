import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {list_qk} from "@/lib/query/query-keys";

export function useList({ list_id }: { list_id: string }) {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: list_qk(list_id),
    queryFn: () => ixApiClient.get_list(list_id)
  })
}