import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Users, IUser } from "../../mongo";

const AUTH_ROUTER = Router();
const secret_key = "123";

AUTH_ROUTER.get('/user', async (req: Request, res: Response) => {
  console.log('checking for cookie');
  if (!req.cookies.token) return res.status(400).json({status: "User not logged in"});
  console.log(req.cookies);

  let username: string | undefined | null = null;

  try {
    const tokenData : any = await jwt.verify(req.cookies.token, secret_key);
    username = tokenData.username;
    console.log(username);
  } catch (err) {
    console.log(err);
    return res.status(400).json({status: 'Invalid Token'});
  }
  
  try {
    const user = await Users.findOne({username});
    if (!user) return res.status(400).json({status: "invalid token"});

    res.status(200).json({status: 'ok', user});
  } catch (err) {
    console.log(err);
    return res.status(500).json({status: "Internal Server Error!"});
  }
});

AUTH_ROUTER.post("/register", async (req: Request, res: Response) => {
    try {
        // check if username already exists
        if (await Users.findOne({ username: req.body.username }))
          return res.status(400).json({ status: "Username Already exists" });
      
          // create new user
          const user = await Users.create({
              name: req.body.name,
              wallet_address: req.body.wallet_address,
              private_key: req.body.private_key,
              username: req.body.username,
              password: req.body.password
          });
      
          await user.save();
            res.status(200).json({ status: "ok", data: user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({status: "Internal Server Error"});
    }
});

interface ITokenData {
  username: string;
}

AUTH_ROUTER.post("/login", async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await Users.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    console.log(user);
    if (!user)
      return res
        .status(400)
        .json({ status: "username or password do not match" });

    const tokenData: ITokenData = {
      username: user.username,
    };

    const token = jwt.sign(tokenData, secret_key);

    res.status(200).json({ status: "ok", token, user: user });
  } catch (err) {
    console.log(err);
  }
});

AUTH_ROUTER.delete('/logout', async (req: Request, res:  Response) => {
  res.clearCookie('token');
  res.status(200).json({status: 'ok'});
});

export default AUTH_ROUTER;
