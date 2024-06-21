const appUrl = 'https://dev.ibc.fun';

export const endpointOptions = {
  getRpcEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rpc/${chainID}`;
  },
  getRestEndpointForChain: async (chainID: string) => {
    return `${appUrl}/api/rest/${chainID}`;
  },
};

export const apiURL = `${appUrl}/api/skip`;
