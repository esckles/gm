import { Application, Request, Response } from "express";
import authUser from "./router/userRouter";
export const mainApp = async (app: Application) => {
  try {
    app.use("/api", authUser);
    app.get("/", (req: Request, res: Response): any => {
      try {
        return res
          .status(200)
          .json({ message: "Welcome to my API", status: 200 });
      } catch (error) {
        return error;
      }
    });
  } catch (error) {
    return error;
  }
};
