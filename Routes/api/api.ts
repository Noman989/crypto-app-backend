import { Router } from "express";
import { CheckBalanceRouter } from './checkbalance';
import { GetContractRouter } from "./getcontract";
import { SendEtherRouter } from './sendether';
import { SwitchBackendRouter } from "./switchbackend";

const API_ROUTER = Router();

API_ROUTER.use('/getbalance', CheckBalanceRouter);
API_ROUTER.use('/sendether', SendEtherRouter);
API_ROUTER.use('/getcontract', GetContractRouter);
API_ROUTER.use('/switchbackend', SwitchBackendRouter);

export default API_ROUTER;
