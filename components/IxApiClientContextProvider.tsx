import { ReactNode } from "react";
import {IxApiClient} from "@/lib/services/IxApiClient";
import {IxApiClientProvider} from "@/hooks/useIxApiClient";

const baseUrl = process.env.IX_API_BASE_URL ?? 'https://api.index-it.app';
const ixApiClient = new IxApiClient(baseUrl);

export default function IxApiClientContextProvider({ children }: { children: ReactNode }) {
  return <IxApiClientProvider client={ixApiClient}>{children}</IxApiClientProvider>;
}