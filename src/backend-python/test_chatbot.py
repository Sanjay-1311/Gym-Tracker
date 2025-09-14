import requests
import json
import time

def test_chatbot():
    """
    Test script to send requests to the Flask chatbot app and display results
    """
    # Base URL for the Flask app
    base_url = "http://localhost:5000"
    
    # Test questions
    test_questions = [
        "How many times a week should I work out?",
        "What is the best exercise for building muscle?",
        "How long should I rest between sets?",
        "What should I eat before a workout?",
        "How can I improve my cardio fitness?",
        "What is the best way to lose fat?",
        "How much water should I drink?",
        "What is Progressive Overload?",
        "Are bodyweight exercises effective?",
        "How do I warm up properly before a workout?",
        "Is it okay to feel sore after a workout?",
        "What are compound vs. isolation exercises?",
        "How many sets and reps should I do for muscle growth?",
        "How long should I rest between sets for building muscle?",
        "How long should I rest between sets for building strength?",
        "What is the best type of cardio for fat loss?",
        "Can I lose fat from just my belly by doing crunches?",
        "What is creatine and is it safe?",
        "How do I know if I'm using the correct form?",
        "Should I stretch before or after my workout?",
        "Is it okay to work out every day?"
    ]
    
    print("🤖 Testing SculptTrack Chatbot (Powered by Groq)")
    print("=" * 50)
    print()
    
    # Check if the server is running
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print("✅ Server is running!")
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start the app.py first:")
        print("   python app.py")
        return
    except Exception as e:
        print(f"❌ Error connecting to server: {e}")
        return
    
    print()
    
    # Test each question
    for i, question in enumerate(test_questions, 1):
        print(f"Question {i}: {question}")
        print("-" * 40)
        
        try:
            # Send POST request to /ask endpoint
            response = requests.post(
                f"{base_url}/ask",
                json={"query": question},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                answer = data.get('answer', 'No answer received')
                print(f"Answer: {answer}")
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.Timeout:
            print("⏰ Request timed out")
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON response: {response.text}")
        
        print()
        time.sleep(1)  # Small delay between requests
    
    print("=" * 50)
    print("✅ Test completed!")

def interactive_test():
    """
    Interactive mode to ask custom questions
    """
    base_url = "http://localhost:5000"
    
    print("🤖 Interactive Chatbot Test")
    print("=" * 50)
    print("Type 'quit' to exit")
    print()
    
    while True:
        question = input("Ask a question: ").strip()
        
        if question.lower() in ['quit', 'exit', 'q']:
            print("Goodbye! 👋")
            break
            
        if not question:
            continue
            
        try:
            response = requests.post(
                f"{base_url}/ask",
                json={"query": question},
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                answer = data.get('answer', 'No answer received')
                print(f"Answer: {answer}")
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.Timeout:
            print("⏰ Request timed out")
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON response: {response.text}")
        
        print()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        interactive_test()
    else:
        test_chatbot()
