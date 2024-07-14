import {useQuery} from "@tanstack/react-query";
import {useIxApiClient} from "@/hooks/useIxApiClient";

export function useLists() {
  const ixApiClient = useIxApiClient();

  return useQuery({
    queryKey: lists_qk,
    queryFn: ixApiClient.get_lists
  })
}