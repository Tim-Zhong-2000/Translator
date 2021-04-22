/**
 * @description /user/ 总路由模块
 * @author Tim-Zhong-2000
 */

import express from "express";
import login from "./login";
import logout from "./logout";
import register from "./register";
import updatePassword from "./updatePassword";
import updateInfo from "./updateInfo";
import updateRole from "./updateRole";
import deleteUser from "./deleteUser";

const router = express.Router();

router.use("/login", login);
router.use("/logout", logout);
router.use("/register", register);
router.use("/update-password", updatePassword);
router.use("/update-info", updateInfo);
router.use("/update-role", updateRole);
router.use("/delete-user", deleteUser);

export default router;
