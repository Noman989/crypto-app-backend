import {
  getContractInfo as web3GetContractInfo,
  getData as web3GetData,
  sendEther as web3SendEther,
} from "./web3";
import {
  getData as ethersGetData,
  getContractInfo as ethersGetContractInfo,
  sendEther as ethersSendEther
} from './ethers';
import {
  IData,
  IResData,
  ITransactionData
} from './interfaces';



export {
  IData,
  IResData,
  ITransactionData,
  ethersGetContractInfo,
  ethersGetData,
  ethersSendEther,
  web3GetContractInfo,
  web3GetData,
  web3SendEther,
};