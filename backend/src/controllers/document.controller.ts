import { Request, Response } from "express";
import fs from "fs";
import {
  extractTextFromPDF,
  generateEmbedding,
  storeVectorInPinecone,
  performNER,
} from "../services/backend.service";

export const ingestDocument = async (
  req: Request,
  res: Response
): Promise<any> => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  try {
    let textContent = "";
    if (file.mimetype === "application/pdf") {
      textContent = await extractTextFromPDF(file.path);
    } else if (file.mimetype === "text/plain") {
      textContent = fs.readFileSync(file.path, "utf-8");
    } else {
      return res
        .status(400)
        .send("Invalid file format. Only PDF and text files are supported.");
    }

    // Step 1: Perform Named Entity Recognition (NER)
    const entities = await performNER(textContent);

    // Step 2: Generate vector embeddings for the text
    const embedding = await generateEmbedding(textContent);

    // Step 3: Store the vector and metadata in Pinecone
    await storeVectorInPinecone(embedding, textContent, entities);

    // Step 4: Clean up uploaded file
    fs.unlinkSync(file.path);

    return res.status(200).json({
      message: "File processed successfully",
      extractedText: textContent.substring(0, 500),
      namedEntities: entities,
    });
  } catch (error) {
    console.error("Error processing the document:", error);
    return res.status(500).send("Error processing the file");
  }
};
