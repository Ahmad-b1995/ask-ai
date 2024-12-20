### **Project Overview**

This project is a full-stack application that allows users to upload documents, ask questions based on the uploaded content, and retrieve answers with relevant document chunks using AI and vector storage.

---

### **Features**

1. **Backend**:

   - Document ingestion via PDF or plain text files.
   - Text extraction, chunking, and Named Entity Recognition (NER).
   - Vector embedding generation and storage in Pinecone.
   - Question answering with context retrieval using GPT-4 API.
   - Retrieval-Augmented Generation (RAG) for enhanced answers.
   - Error handling and input validation.

2. **Frontend**:

   - User-friendly drag-and-drop file upload.
   - Display of processing status and uploaded file details.
   - Question submission with real-time answer display and relevant chunks visualization.

3. **Python Script**:
   - Performs topic modeling on ingested documents.
   - Updates document metadata in Pinecone with extracted topics.

---

### **Technologies**

- **Backend**: Node.js (Express)
- **Frontend**: React (with Tailwind CSS for styling)
- **Vector Storage**: Pinecone
- **AI APIs**: GPT-4 API
- **Additional**: Python for topic modeling

---

### **Setup Instructions**

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
  - Populate `.env.example` file at the root of the project with your API keys for Pinecone and GPT and rename the file to .env.

2. **Backend**:

   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Frontend**:

   - Navigate to the frontend folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

4. **Python Script**:
   - Navigate to the Python folder:
     ```bash
     cd python
     ```
   - Install required libraries:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the topic modeling script:
     ```bash
     python topic_modeling.py
     ```

---

### **Usage**

1. Upload a document through the drag-and-drop interface on the frontend.
2. Ask a question related to the document content.
3. View the AI-generated answer and relevant document chunks.

---

### **Evaluation Criteria**

- Successful integration of Pinecone and AI API.
- Functional RAG system and accurate answers.
- User-friendly frontend design.
- Robust error handling and validation.

---

### **Challenges**

- OpenAI integration because of a problem with my account and insufficient token credit (The code is unfortunately tested with mock data and not real data from openAI. Please share an api key and will test them. Thanks)
- Vector Demension Mismatch: Local models output lower dimension than required by Pinecone which makes it storage-intensive to download a large 10 gig model for local embeddings.

---

Feel free to modify and extend the project as needed!
