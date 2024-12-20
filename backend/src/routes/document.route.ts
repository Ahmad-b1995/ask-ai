import { Router } from "express";
import { ingestDocument } from "../controllers/document.controller";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/ingest', upload.single('file'), ingestDocument);

export default router;
