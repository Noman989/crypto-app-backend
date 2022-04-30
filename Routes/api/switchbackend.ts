import { Router, Request, Response } from "express";
import { BackendSwitch, toggleBackend } from "../../ether/backendSwitch";

const SwitchBackendRouter = Router();

SwitchBackendRouter.get('/', (req: Request, res: Response) => {
  res.status(200).json({status: 'ok', backend: BackendSwitch.backend });
});

SwitchBackendRouter.put("/", (req: Request, res: Response) => {
  toggleBackend(req.body.backend);
  console.log(req.body);
  res.status(200).json({ status: "ok" });
});

export { SwitchBackendRouter };
