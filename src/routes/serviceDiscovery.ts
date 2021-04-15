import fs from "fs";
import express from "express"

const router = express.Router();

router.get("/",(_req,res)=>{
    const png = fs.createReadStream("./servicediscovery.png");
    png.pipe(res);
})

export default router;