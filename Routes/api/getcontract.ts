import { Router, Request, Response } from "express";
import { IData, web3GetContractInfo, ethersGetContractInfo, IResData } from '../../ether/ether';
import { BackendSwitch } from '../../ether/backendSwitch';

const GetContractRouter = Router();

GetContractRouter.get('/', async (req: Request, res: Response) => {
    const address: any = req.query.address;
    const chain: any = req.query.chain;
    const reqData: IData = {
        address,
        chain,
    };
    const resData: IResData =  BackendSwitch.backend === 'ethersjs' ? await ethersGetContractInfo(reqData): await web3GetContractInfo(reqData);
    res.status(200).json({status: 'ok', data: resData});
});

export { GetContractRouter };