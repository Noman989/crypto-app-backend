import Web3 from "web3";
import Axios from "axios";
import Common, { CustomChain } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";

const CryptoCompareAPI =
  "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD,EUR";

const MAINNET_URL =
  "https://mainnet.infura.io/v3/051c129edf6b4cf386619981ddc8bce4";
const ROPSTEN_URL =
  "https://ropsten.infura.io/v3/051c129edf6b4cf386619981ddc8bce4";

const ABI: any = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "value", type: "uint256" }],
    name: "burn",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "decimals", type: "uint8" },
      { name: "totalSupply", type: "uint256" },
      { name: "feeReceiver", type: "address" },
      { name: "tokenOwnerAddress", type: "address" },
    ],
    payable: true,
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
];

// const web3 = new Web3(MAINNET_URL);

const getChainURL = (chain: string) => {
  return chain === "mainnet" ? MAINNET_URL : ROPSTEN_URL;
};

interface IData {
  address: string;
  chain: "ropsten" | "mainnet";
}
const getData = async ({ address, chain }: IData) => {
  try {
    const Provider = new Web3.providers.HttpProvider(getChainURL(chain));
    const web3 = new Web3(Provider);

    // Get balance
    const balance = await web3.eth.getBalance(address);
    console.log(balance);

    // Convert balance to ether
    const balanceInEther = web3.utils.fromWei(balance, "ether");
    console.log(balanceInEther);

    // get conversion rate
    const result = await Axios.get(CryptoCompareAPI);
    console.log(result.data);

    // convert
    const balanceInUSD = parseFloat(balanceInEther) * result.data.USD;
    const balanceInEuro = parseFloat(balanceInEther) * result.data.EUR;
    const ResponseData = {
      address,
      balanceInEther,
      balanceInUSD,
      balanceInEuro,
    };
    console.log(ResponseData);

    return ResponseData;
  } catch (err) {
    console.error(err);
    throw new Error("Service Crashed : Web3.js");
  }
};

const getCommon = (chain: string) => {
  if (chain === "ropsten") {
    return { chain: "ropsten", hardfork: "petersburg" };
  } else {
    return { chain: "mainnet", hardfork: "petersburg" };
  }
};

interface ITransactionData {
  from: string;
  to: string;
  privateKey: string;
  chain: "ropsten" | "mainnet";
  amount_in_ether: number;
}
const sendEther = async ({
  chain,
  from,
  privateKey,
  to,
  amount_in_ether,
}: ITransactionData) => {
  try {
    const Provider = new Web3.providers.HttpProvider(getChainURL(chain));
    const web3 = new Web3(Provider);

    const nonce = await web3.eth.getTransactionCount(from);

    const txData = {
      from,
      to,
      nonce: web3.utils.toHex(nonce),
      value: web3.utils.toHex(web3.utils.toWei(`${amount_in_ether}`, "ether")),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      gasLimit: web3.utils.toHex(21000),
    };

    const common = new Common(getCommon(chain));

    // creating and signing transaction
    const tx = Transaction.fromTxData(txData, { common });
    const signedTx = tx.sign(Buffer.from(privateKey, "hex"));
    console.log(signedTx);

    // serializing transaction
    const serializedTx = signedTx.serialize();
    console.log(serializedTx);

    // Raw
    const raw = `0x${serializedTx.toString("hex")}`;
    console.log(raw);

    // Broad Casting transaction can take up to a minute
    const txHash = await web3.eth.sendSignedTransaction(raw);
    console.log("txHash:", txHash);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

interface IResData {
    name: string;
    totalSupply: string;
    symbol: string;
    decimals: string;
}
const getContractInfo = async ({ address, chain }: IData) => {
  const Provider = new Web3.providers.HttpProvider(getChainURL(chain));
  const web3 = new Web3(Provider);

  const contract = new web3.eth.Contract(ABI, address);
  console.log(contract.methods);
  const name = await contract.methods.name().call();
  const totalSupply = await contract.methods.totalSupply().call();
  const symbol = await contract.methods.symbol().call();
  const decimals = await contract.methods.decimals().call();

  const resData: IResData = {
      name,
      totalSupply: web3.utils.fromWei(totalSupply, 'ether'),
      symbol,
      decimals,
  };
  console.log(resData);
  return resData;
};

export { getData, IData, ITransactionData, sendEther, getContractInfo, IResData };
