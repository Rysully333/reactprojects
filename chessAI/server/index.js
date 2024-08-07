import express from 'express'
import { exec } from 'child_process';

import pkg from '@lmstudio/sdk';
const { LMStudioClient } = pkg;

async function main() {
  // Create a client to connect to LM Studio, then load a model
  const client = new LMStudioClient();
  const model = await client.llm.load("Meta/Llama/Meta-Llama-3.1-8B-Instruct-128k-Q4_0.gguf");

  // Predict!
  const prediction = model.respond([
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "user", content: "What is the capital of France?" },
  ]);
  for await (const text of prediction) {
    process.stdout.write(text);
  }
}

main();