import Axios from "axios";
import { ethers } from "ethers";
import { IData, IResData, ITransactionData } from "./interfaces";

const CryptoCompareAPI =
  "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD,EUR";

const getProvider = (chain: "mainnet" | "ropsten") => {
  const INFURA_ID = "051c129edf6b4cf386619981ddc8bce4";

  return new ethers.providers.JsonRpcProvider(
    `https://${chain}.infura.io/v3/${INFURA_ID}`
  );
};

const getData = async ({ address, chain }: IData) => {
  try {
    const provider = getProvider(chain);

    // Get Balance
    const balance = await provider.getBalance(address);
    console.log(balance);

    // Convert Balance to ether
    const balanceInEther = ethers.utils.formatEther(balance);
    console.log(`${address} --> Balance In Ether ${balanceInEther}`);

    // Get Conversion Rate
    const result = await Axios.get(CryptoCompareAPI);
    console.log(result.data);

    // Convert
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

const sendEther = async ({
  chain,
  from,
  privateKey,
  to,
  amount_in_ether
}: ITransactionData) => {
  try {
    const provider = getProvider(chain);
    const wallet = new ethers.Wallet(privateKey, provider);

    // balance before transfer
    // console.log(`from: ${ethers.utils.formatEther(await provider.getBalance(from))} \nto: ${ethers.utils.formatEther(await provider.getBalance(to))}`);

    const tx = await wallet.sendTransaction({
      to,
      from,
      value: ethers.utils.parseEther(`${amount_in_ether}`),
    });

    console.log(tx);
    // await tx.wait();
    // console.log(tx);
    // console.log(`from: ${ethers.utils.formatEther(await provider.getBalance(from))} \nto: ${ethers.utils.formatEther(await provider.getBalance(to))}`);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getContractInfo = async ({ address, chain }: IData) => {
  const provider = getProvider(chain);

  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  const contract = new ethers.Contract(address, ERC20_ABI, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const totalSupply = await contract.totalSupply();
  const decimals = await contract.decimals();
  
  const resData: IResData = {
    name,
    totalSupply: ethers.utils.formatEther(totalSupply),
    symbol,
    decimals
  };
  console.log(resData);
  return resData;
};

export { getData, getContractInfo, sendEther };
