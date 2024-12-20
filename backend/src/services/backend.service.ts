import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import axios from "axios";
import pdfParse from "pdf-parse";
import fs from "fs";

dotenv.config({ path: "../.env" });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

const retrieveRelevantChunks = async (
  question: string
): Promise<{ text: string; score: number }[]> => {
  try {
    const queryEmbedding = await generateEmbedding(question);
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });
    return queryResponse.matches.map((match: any) => ({
      text: match.metadata.text,
      score: match.score,
    }));
  } catch (error) {
    console.error("Error retrieving relevant chunks from Pinecone:", error);
    return [];
  }
};

const storeVectorInPinecone = async (
  embedding: number[],
  text: string,
  entities: any[] = []
) => {
  const record = {
    id: generateUniqueId(),
    values: embedding,
    metadata: {
      text: text.substring(0, 500),
      entities,
    },
  };
  await index.upsert([record]);
};

const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      { model: "text-embedding-ada-002", input: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
};

const extractTextFromPDF = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

const performNER = async (text: string): Promise<any[]> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Extract named entities (people, organizations, locations, dates, etc.) from the following text:\n\n${text}`,
        max_tokens: 500,
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0]?.text.trim().split("\n") || [];
  } catch (error) {
    console.error("Error performing NER:", error);
    return [];
  }
};

const generateUniqueId = (): string => {
  return `vector-${Date.now()}`;
};

export {
  generateEmbedding,
  storeVectorInPinecone,
  retrieveRelevantChunks,
  generateUniqueId,
  extractTextFromPDF,
  performNER,
};
