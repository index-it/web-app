import * as React from 'react'
import {IxApiClient} from "@/lib/services/IxApiClient";

export const IxApiClientContext = React.createContext<IxApiClient | undefined>(
  undefined,
)

export const useIxApiClient = (ixApiClient?: IxApiClient) => {
  const client = React.useContext(IxApiClientContext)

  if (ixApiClient) {
    return ixApiClient
  }

  if (!client) {
    throw new Error('No IxApiClient set, use IxApiClientProvider to set one')
  }

  return client
}

export type IxApiClientProviderProps = {
  client: IxApiClient
  children?: React.ReactNode
}

export const IxApiClientProvider = ({
  client,
  children,
}: IxApiClientProviderProps): React.JSX.Element => {
  React.useEffect(() => {
    client.mount()
    return () => {
      client.unmount()
    }
  }, [client])

  return (
    <IxApiClientContext.Provider value={client}>
      {children}
    </IxApiClientContext.Provider>
  )
}
