import env from "dotenv";
import { connect } from "mongoose";
env.config();

export const dbConfig = async () => {
  try {
    await connect(process.env.MONGO_URL as string).then(() => {
      console.clear();
      console.log("Connected🟢");
    });
  } catch (error) {
    return error;
  }
};
