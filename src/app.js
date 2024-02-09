import express from "express";
import cors from "cors";
import morgan from "morgan";

import * as middleware from "./utils/middleware.js";
import helloRoute from "./routes/helloRouter.js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import noir_program from "./circuit/target/hello.json" assert { type: "json" };
import express from "express";



const app = express();

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});


app.get("/proof", async (req, res) => {
  console.log({ noir_program });

  const inputs = { x: 1, y: 2 };
  const backend = new BarretenbergBackend(noir_program);
  const program = new Noir(noir_program, backend);

  console.log("Getting proof data...");
  const proofData = await program.generateFinalProof(inputs);
  const verifiedProof = await program.generateFinalProof(inputs);

  console.log("done");
  console.log({ proofData });
  res.json({ proofData, verifiedProof });
});


// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
