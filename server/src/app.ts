import express from "express";
import mainRouter from "./routes/routes";
import log from "./utils/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// main router call
app.use("/api/v1", mainRouter);

// static frontend routing
app.use(express.static("frontend-build"));

// TODO - error handler

export default app;
