import cors from "cors";
import express from "express";
import morgan from "morgan";

import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import noir_program from "../circuit/target/sudoku.json" assert { type: "json" };
import * as middleware from "./utils/middleware.js";



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

app.post("/proof", async (req, res) => {

  const solutionString = req.body.solution
  console.log({solutionString})
  const solution = solutionString.split("").map(Number)
  console.log({solution})

  const backend = new BarretenbergBackend(noir_program);
  const program = new Noir(noir_program, backend);

  console.log("Getting proof data...");
  try {
    const proofData = await program.generateFinalProof({solution});
    const verifiedProof = await program.verifyFinalProof(proofData);

    console.log("done");
    console.log({ proofData });

    return res.status(200).json({ proofData, verifiedProof });
  } catch (error) {
    return res.status(500).json({error: "Incorrect Solutino"})
  }
});


// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
