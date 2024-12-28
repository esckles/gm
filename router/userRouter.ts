import { Router } from "express";
import {
  changePassword,
  createAccount,
  forgetPasssword,
  LoginAccount,
  readAlluser,
  readOneuser,
  VerifyAccount,
} from "../controller/userController";

const router: any = Router();

//createAccount
router.route("/create-user").post(createAccount);
router.route("/verify-user/:userID").get(VerifyAccount);
router.route("/login-user").post(LoginAccount);
//createAccount

//readUsers
router.route("/readOne/:userID").get(readOneuser);
router.route("/readAll").get(readAlluser);
//readUsers

//forgetpassword
router.route("/forget-password/:userID").patch(forgetPasssword);
router.route("/change-password/:userID").patch(changePassword);

//forgetpassword

export default router;
