import Web3 from "web3";
import Axios from "axios";
import Common, { CustomChain } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
import { IData, IResData, ITransactionData } from './interfaces';
import { ABI as erc20ABI } from './erc20abi';

const CryptoCompareAPI =
  "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD,EUR";

const MAINNET_URL =
  "https://mainnet.infura.io/v3/051c129edf6b4cf386619981ddc8bce4";
const ROPSTEN_URL =
  "https://ropsten.infura.io/v3/051c129edf6b4cf386619981ddc8bce4";

const ABI: any = erc20ABI;

// const web3 = new Web3(MAINNET_URL);

const getChainURL = (chain: string) => {
  return chain === "mainnet" ? MAINNET_URL : ROPSTEN_URL;
};

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

export { getData, sendEther, getContractInfo };
