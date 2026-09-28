import cors from "cors";
import express from "express";
import helmet from "helmet";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:5173" }));
  app.use(express.json({ limit: "16kb" }));

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  return app;
};
