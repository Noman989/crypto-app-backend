import { Router, Request, Response } from "express";
import { getData, IData } from '../../ether';

const CheckBalanceRouter = Router();

CheckBalanceRouter.get('/', async (req: Request, res: Response) => {
    const address: any = req.query.address;
    const chain: any = req.query.chain;
    const reqData: IData = {
        address,
        chain
    };
    const data = await getData(reqData);
    res.status(200).json({status: 'ok', data: data});
});

export { CheckBalanceRouter };