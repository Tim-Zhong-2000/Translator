import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session || !req.session.user) {
    res.statusCode = 401;
    res.send("Not Login");
  }
  req.session.destroy((err) => {
    if (err) {
      res.statusCode = 500;
      res.send("Logout Fail");
    }
    res.send("Logout Successfully");
  });
});

export default router;
