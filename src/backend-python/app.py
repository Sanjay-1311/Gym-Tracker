import os
from groq import Groq
import chromadb
from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- INITIALIZATION ---

# 1. Configure the Groq API Key
try:
    groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])
except KeyError:
    print("🔴 GROQ_API_KEY environment variable not set.")
    print("   Please set it by running 'export GROQ_API_KEY=YOUR_KEY' in your terminal.")
    print("   Or create a .env file with GROQ_API_KEY=your_key_here")
    exit()

# 2. Initialize the models
print("Initializing models...")
# Using Groq's latest open source models

generation_model = "llama-3.1-8b-instant"  # Fast and efficient 8B model - perfect for chatbots
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# 3. Connect to ChromaDB
print("Connecting to ChromaDB...")
client = chromadb.PersistentClient(path="/var/data/chroma_db")
try:
    collection = client.get_collection("fitness_faq")
    print("✅ Found existing fitness_faq collection")
except Exception as e:
    print("⚠️  fitness_faq collection not found. Creating it...")
    collection = client.create_collection("fitness_faq")
    print("✅ Created new fitness_faq collection")
    print("💡 Run 'python Ingest.py' to populate the collection with data")

# 4. Initialize the Flask App
app = Flask(__name__)

# --- CORE RAG FUNCTION ---

def generate_response(user_query):
    """
    Performs the Retrieve-Augment-Generate (RAG) process.
    """
    print(f"Received query: {user_query}")
    
    # 1. RETRIEVE: Find the most relevant document in ChromaDB
    print("  > Retrieving relevant context from ChromaDB...")
    
    # Check collection count first
    try:
        count = collection.count()
        print(f"  > Collection has {count} documents")
    except Exception as e:
        print(f"  > Error checking collection count: {e}")
    
    query_embedding = embedding_model.encode([user_query])
    results = collection.query(
        query_embeddings=query_embedding.tolist(),
        n_results=3
    )
    
    if not results['documents'][0]:
        print("  > No context found in knowledge base, using Groq directly...")
        # Fallback to direct Groq response when no context is available
        prompt = f"""
        You are a friendly and knowledgeable fitness assistant.
        Answer the user's fitness question in a helpful and encouraging tone.
        Provide practical, evidence-based advice for fitness and exercise.

        USER'S QUESTION:
        {user_query}

        YOUR ANSWER:
        """
        
        response = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=generation_model,
            temperature=0.7,
            max_tokens=1000
        )
        return response.choices[0].message.content
        
    context = results['metadatas'][0][0]['answer']
    retrieved_question = results['documents'][0][0]
    print(f"  > Context found: {retrieved_question}")
    
    # 2. AUGMENT: Create a prompt for the Groq model
    prompt = f"""
    You are a friendly and knowledgeable fitness assistant.
    Based ONLY on the following context, answer the user's question in a helpful and encouraging tone.
    If the context doesn't contain the answer, say that you don't have enough information.

    CONTEXT:
    {context}

    USER'S QUESTION:
    {user_query}

    YOUR ANSWER:
    """
    
    # 3. GENERATE: Get the final answer from Groq
    print("  > Generating final answer with Groq...")
    response = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=generation_model,
        temperature=0.7,
        max_tokens=1000
    )
    
    return response.choices[0].message.content

# --- API ENDPOINT ---

@app.route('/ask', methods=['POST'])
def handle_ask():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Query not provided'}), 400

    user_query = data['query']
    answer = generate_response(user_query)
    
    return jsonify({'answer': answer})

# --- MAIN EXECUTION ---

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5001, debug=False)