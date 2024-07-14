import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";
import {lists_qk} from "@/lib/query/query-keys";

export function useLists() {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: lists_qk,
    queryFn: ixApiClient.get_lists
  })
}