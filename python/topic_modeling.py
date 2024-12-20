import openai
from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv

load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = os.getenv("PINECONE_ENV")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not all([PINECONE_API_KEY, PINECONE_ENV, INDEX_NAME, OPENAI_API_KEY]):
    raise ValueError("Missing one or more required environment variables: PINECONE_API_KEY, PINECONE_ENV, INDEX_NAME, OPENAI_API_KEY")

openai.api_key = OPENAI_API_KEY

try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    if INDEX_NAME not in pc.list_indexes().names():
        pc.create_index(
            name=INDEX_NAME,
            dimension=1536,
            metric='euclidean',
            spec=ServerlessSpec(
                cloud='aws',
                region=PINECONE_ENV
            )
        )
    index = pc.Index(INDEX_NAME)
except Exception as e:
    raise RuntimeError(f"Failed to initialize Pinecone: {e}")


def embed_documents(documents):
    try:
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=documents
        )
        embeddings = [data['embedding'] for data in response['data']]
        return embeddings
    except Exception as e:
        raise RuntimeError(f"Embedding generation failed: {e}")


def update_metadata(doc_id, vector, metadata):
    try:
        index.upsert([(doc_id, vector, metadata)])
    except Exception as e:
        raise RuntimeError(f"Failed to upsert metadata for {doc_id}: {e}")


def main():
    documents = [
        "Artificial intelligence and machine learning are revolutionizing industries.",
        "Natural language processing enables machines to understand human speech.",
        "Deep learning models are powerful but require large datasets.",
    ]

    vectors = embed_documents(documents)

    for i, (vector, doc) in enumerate(zip(vectors, documents)):
        metadata = {"content": doc}
        doc_id = f"doc_{i}"
        update_metadata(doc_id, vector, metadata)
        print(f"Upserted {doc_id} with content: {doc}")


if __name__ == "__main__":
    main()
