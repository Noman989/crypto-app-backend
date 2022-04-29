import { Router, Request, Response } from "express";
import { IData, getContractInfo, IResData } from '../../ether';

const GetContractRouter = Router();

GetContractRouter.get('/', async (req: Request, res: Response) => {
    const address: any = req.query.address;
    const chain: any = req.query.chain;
    const reqData: IData = {
        address,
        chain,
    };
    const resData: IResData = await getContractInfo(reqData);
    res.status(200).json({status: 'ok', data: resData});
});

export { GetContractRouter };