import express from "express";
import { errBody } from "../utils/errorPayload";

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session || !req.session.user) {
    res.status(401).json(errBody(401,"not login"));
  }
  req.session.destroy((err) => {
    if (err) res.status(500).send("Logout Fail");
    res.send("Logout Successfully");
  });
});

export default router;
