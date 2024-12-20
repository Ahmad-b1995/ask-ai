import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import documentRoutes from './routes/document.route';
import questionRoutes from './routes/question.route';
const app = express();

dotenv.config({ path: "../.env" });

app.use(cors());

app.use(express.json());

app.use('/api/documents', documentRoutes);
app.use('/api/questions', questionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
