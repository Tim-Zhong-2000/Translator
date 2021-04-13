/**
 * @description 读取配置文件
 * @author Tim-Zhong-2000
 */

import fs from "fs";
import os from "os";

// 加载所有配置
const CONFIG = JSON.parse(
  fs.readFileSync(
    os.type() === "Linux" ? "/etc/tim-translator/config.json" : "./config.json",
    "utf-8"
  )
);
export default CONFIG;
