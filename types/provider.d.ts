type ProviderMessage = {
  readonly type: string;
  readonly data: unknown;
};

type ProviderConnectInfo = {
  readonly chainId: string;
};

type RequestArguments = {
  readonly method: string;
  readonly params?: unknown[] | Record<string, unknown>;
};

export type EthEvents = {
  message: (message: ProviderMessage) => void;
  connect: (info: ProviderConnectInfo) => void;
  disconnect: (code: number, reason: string) => void;
  chainChanged: (network: { chainId: string }) => void;
  accountsChanged: (accounts: string[]) => void;
};

export type ProviderAPI = {
  request<Response>(request: {
    method: string;
    params: unknown[];
  }): Promise<Response>;
  on<T extends keyof EthEvents>(eventName: T, listener: EthEvents[T]): this;
  off<T extends keyof EthEvents>(eventName: T, listener: EthEvents[T]): this;
};
