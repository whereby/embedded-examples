import Cors from "cors";
import Whereby from "../../../lib/whereby";
import { initMiddleware } from "../../../lib/middleware";

export const wb = new Whereby({
  apiKey: process.env.WHEREBY_API_KEY,
  webhookSecret: process.env.WHEREBY_WEBHOOK_SECRET,
});

export const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
  })
);
