import { Router, Request, Response } from "express";
import { web3GetData, ethersGetData, IData } from '../../ether/ether';
import { BackendSwitch } from "../../ether/backendSwitch";

const CheckBalanceRouter = Router();

CheckBalanceRouter.get('/', async (req: Request, res: Response) => {
    const address: any = req.query.address;
    const chain: any = req.query.chain;
    const reqData: IData = {
        address,
        chain
    };
    const data = BackendSwitch.backend === 'ethersjs' ? await ethersGetData(reqData): await web3GetData(reqData);
    res.status(200).json({status: 'ok', data: data});
});

export { CheckBalanceRouter };