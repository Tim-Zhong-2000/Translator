/**
 * @description 登录接口
 * @author Tim-Zhong-2000
 */

import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { USER } from "../type/type";

const router = express.Router();
router.use(cookieParser());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/login", (req, res) => {

});

router.post("/login", (req, res) => {
    const User:USER.User = req.body;
    res.setHeader("Set-Cookie",[]);
});
