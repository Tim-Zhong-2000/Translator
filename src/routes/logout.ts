import express from "express";
import { errBody } from "../utils/errorPayload";

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session || !req.session.user) {
    res.status(401).json(errBody(401, "Not Login"));
    return;
  }
  req.session.destroy((err) => {
    if (err) res.status(500).json(errBody(500, "Remove Session Error"));
    res.send("Logout Successfully");
  });
});

export default router;
