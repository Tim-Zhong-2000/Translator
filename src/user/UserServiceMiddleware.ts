import { Request, Response, NextFunction } from "express";
import CONFIG from "../utils/config";
import { UserService } from "./UserService";

const userService = new UserService(CONFIG["serverConfig"]["db"]);

function appendUserService(req: Request, res: Response, next: NextFunction) {
  req.userService = userService;
  next();
}

export default appendUserService;
