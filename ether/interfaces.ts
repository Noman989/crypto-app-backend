export interface ITransactionData {
  from: string;
  to: string;
  privateKey: string;
  chain: "ropsten" | "mainnet";
  amount_in_ether: number;
}

export interface IData {
  address: string;
  chain: "ropsten" | "mainnet";
}

export interface IResData {
  name: string;
  totalSupply: string;
  symbol: string;
  decimals: string;
}