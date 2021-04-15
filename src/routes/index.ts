/**
 * @description 路由-起始页
 * @author Tim-Zhong-2000
 */

import express from "express";

const router = express.Router();

router.get("/",(_req,res)=>{
    res.send("123");
})

export default router;