"use client";

import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {IxApiError} from "@/lib/models/index/core/IxApiError";
import {IxApiErrorResponse} from "@/lib/services/IxApiErrorResponse";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // TODO: Test istanceof
        if (error instanceof IxApiError && error.ixApiErrorResponse == IxApiErrorResponse.NOT_AUTHENTICATED) {
          return false
        }

        return failureCount <= 2
      }
    }
  }
});

export default function QueryClientContextProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}