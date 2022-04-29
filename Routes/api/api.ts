import { Router } from "express";
import { CheckBalanceRouter } from './checkbalance';
import { GetContractRouter } from "./getcontract";
import { SendEtherRouter } from './sendether';

const API_ROUTER = Router();

API_ROUTER.use('/getbalance', CheckBalanceRouter);
API_ROUTER.use('/sendether', SendEtherRouter);
API_ROUTER.use('/getcontract', GetContractRouter);

export default API_ROUTER;
