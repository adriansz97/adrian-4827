import cors from "cors";
import express from "express";
import helmet from "helmet";

import { snailPayRouter } from "./snailpay/snailpay.router.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    }),
  );

  app.use(
    express.json({
      limit: "16kb",
    }),
  );

  app.get("/api/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
    });
  });

  app.use("/api/snailpay", snailPayRouter);

  return app;
};
