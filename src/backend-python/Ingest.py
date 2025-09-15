import chromadb
import pandas as pd
from sentence_transformers import SentenceTransformer

# 1. Initialize a persistent ChromaDB client
print("Initializing persistent ChromaDB client...")
client = chromadb.PersistentClient(path="/var/data/chroma_db")

# 2. Get or create the collection
collection = client.get_or_create_collection("fitness_faq")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# 3. Load the clean dataset
file_path = "knowledge_base.csv"
print(f"Loading dataset from {file_path}...")
try:
    df = pd.read_csv(file_path)
except FileNotFoundError:
    print(f"❌ Error: {file_path} not found. Please make sure you've created it.")
    exit()

# 4. Prepare data for ChromaDB
documents = df['question'].tolist()
metadatas = [{'answer': answer} for answer in df['answer'].tolist()]
ids = [f"faq_{id}" for id in df['id'].tolist()]

# 5. Ingest the data (no batching needed for this size)
print(f"Ingesting {len(documents)} documents into ChromaDB...")
collection.add(
    embeddings=embedding_model.encode(documents).tolist(),
    documents=documents,
    metadatas=metadatas,
    ids=ids
)

print("\n✅ Knowledge base has been successfully ingested!")
print("   You can now run your app.py server.")
