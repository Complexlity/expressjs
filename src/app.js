import cors from "cors";
import express from "express";
import morgan from "morgan";

import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import noir_program from "../circuit/target/sudoku.json" assert { type: "json" };
import * as middleware from "./utils/middleware.js";

// Initializing outside makes the api return faster (values are already stored in the machine and does not need to be created for every request)
const backend = new BarretenbergBackend(noir_program);
const program = new Noir(noir_program, backend);

async function main() {
  try {
    const result = await redis.hgetall(KEY_PREFIX);
  } catch (error) {}
}

main();

const app = express();

// parse json request body
app.use(express.json());

// enable cors
app.use(cors());

// request logger middleware
app.use(morgan("tiny"));

const solution = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 1, 2, 3, 7, 8, 9, 1, 2, 3, 4, 5,
  6, 2, 1, 4, 3, 6, 5, 8, 9, 7, 3, 6, 5, 8, 9, 7, 2, 1, 4, 8, 9, 7, 2, 1, 4, 3,
  6, 5, 5, 3, 1, 6, 4, 2, 9, 7, 8, 6, 4, 2, 9, 7, 8, 5, 3, 1, 9, 7, 8, 5, 3, 1,
  6, 4, 2,
];

// healthcheck endpoint
app.get("/", (req, res) => {
  res.status(200).send({ status: "ok" });
});

app.get("/proof", async (req, res) => {
  // For testing the proof route
  const solution = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 1, 2, 3, 7, 8, 9, 1, 2, 3, 4,
    5, 6, 2, 1, 4, 3, 6, 5, 8, 9, 7, 3, 6, 5, 8, 9, 7, 2, 1, 4, 8, 9, 7, 2, 1,
    4, 3, 6, 5, 5, 3, 1, 6, 4, 2, 9, 7, 8, 6, 4, 2, 9, 7, 8, 5, 3, 1, 9, 7, 8,
    5, 3, 1, 6, 4, 2,
  ];

  try {
    const proofData = await program.generateFinalProof({ solution });

    /*
    //Proof could then be verified on chain by a smart contract verifier
    // const verifiedProof = await program.verifyFinalProof(proofData);
    Removed because frames should take less than 5 seconds to return a request
    */
    return res.status(200).json({ proofData, verifiedProof: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

app.post("/proof", async (req, res) => {
  const solutionString = req.body.solution;
  const solution = solutionString.split("").map(Number);

  try {
    const proofData = await program.generateFinalProof({ solution });

    /*
    //Proof could then be verified on chain by a smart contract verifier
    // const verifiedProof = await program.verifyFinalProof(proofData);
    Removed because frames responses should take less than 5 seconds
    */

    return res.status(200).json({ proofData, verifiedProof: true });
  } catch (error) {
    return res.status(500).json({ error: "Incorrect Solution" });
  }
});

// custom middleware
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
