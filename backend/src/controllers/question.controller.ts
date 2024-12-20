import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { retrieveRelevantChunks } from "../services/backend.service";

dotenv.config({ path: "../.env" });

export const answerQuestion = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).send("Question is required");
  }
  try {
    const relevantChunks = await retrieveRelevantChunks(question);

    if (relevantChunks.length === 0) {
      return res.status(204).send("No relevant chunks found");
    }

    const prompt = `
You are an intelligent assistant. Based on the following context, answer the question:
Context: ${relevantChunks.map((chunk) => chunk.text).join("\n")}
Question: ${question}
Answer:
    `;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0].message.content;

    const chunksWithConfidence = relevantChunks.map((chunk) => ({
      text: chunk.text,
      score: chunk.score,
    }));

    res
      .status(200)
      .json({ question, answer, relevantChunks: chunksWithConfidence });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).send("Error answering the question");
  }
};
