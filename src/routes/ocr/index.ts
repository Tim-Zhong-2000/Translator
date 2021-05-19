import fs from "fs";
import { exec, spawn } from "child_process";
import express, { Request, Response } from "express";
import { checkLogin } from "../../utils/userSession";
import multer from "multer";
import CONFIG from "../../utils/config";
import { errBody } from "../../utils/errorPayload";

fs.mkdir(CONFIG.ocr.dir, (err) => {
  console.log(err);
});

const upload = multer({ dest: CONFIG.ocr.dir });

const router = express.Router();

// router.use(checkLogin());
function ocrProcess(picname: string, lang: string, id: string) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const process = spawn("tesseract", [picname, id, "-l", lang]);
    process.stdout.on("data", (chunk) => {
      buffer += chunk;
    });
    process.on("error", (err) => reject(err));
    process.on("exit", (code, _signal) => {
      console.log(`
          ${id} exit with code ${code}
          stdout:
          ${buffer}
      `);
      resolve(buffer);
    });
  });
}

function readDest(id: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${id}.txt`, { encoding: "utf-8" }, (err, data) => {
      if (err) reject("读取输出失败");
      else resolve(data as string);
    });
  });
}

router.get(
  "/:lang",
  upload.single(CONFIG.ocr.fieldName),
  async (req: Request, res: Response) => {
    const { lang } = req.params; // 语言
    const id = Date.now().toString() + (Math.random() * 1000).toFixed(0); // 输出id
    // 执行ocr
    try {
      await ocrProcess("", lang, id);
    } catch (_) {
      res.status(500).json(errBody(500, "OCR过程错误"));
      return;
    }
    // 读取结果
    try {
      res.json({ dst: await readDest(id) });
    } catch (err) {
      res.status(500).json(errBody(500, err));
    }
  }
);

export default router;
