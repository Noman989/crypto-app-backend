import { Router, Request, Response } from "express";
import { ITransactionData, sendEther } from '../../ether';

const SendEtherRouter = Router();

SendEtherRouter.post('/', async (req: Request, res: Response) => {
    console.log(req.body);
    const TransactionData: ITransactionData = {
        chain: req.body.chain,
        from: req.body.from,
        to: req.body.to,
        privateKey: req.body.privateKey,
        amount_in_ether: req.body.amount_in_ether,
    };
    (async () => {
        const result = await sendEther(TransactionData);
        if (result) 
            res.status(200).json({status: 'ok', TransactionData});
        else res.status(500).json({status: "Internal Server Error"});
    })();
});

export { SendEtherRouter };