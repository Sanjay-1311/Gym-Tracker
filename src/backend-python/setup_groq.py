#!/usr/bin/env python3
"""
Setup script for Groq API key configuration
"""

import os
from pathlib import Path

def setup_groq_api():
    """
    Interactive setup for Groq API key
    """
    print("🚀 Groq API Setup for SculptTrack Chatbot")
    print("=" * 50)
    
    # Check if .env file exists
    env_file = Path(".env")
    
    if env_file.exists():
        print("📁 Found existing .env file")
        with open(env_file, 'r') as f:
            content = f.read()
            if "GROQ_API_KEY" in content:
                print("✅ GROQ_API_KEY already configured in .env file")
                return
    
    print("\n🔑 To get your Groq API key:")
    print("1. Visit: https://console.groq.com/keys")
    print("2. Sign up for a free account")
    print("3. Create a new API key")
    print("4. Copy the key")
    
    api_key = input("\n📝 Enter your Groq API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided. Exiting...")
        return
    
    # Create or update .env file
    env_content = f"""# Groq API Configuration
# Get your API key from: https://console.groq.com/keys
GROQ_API_KEY={api_key}

# Note: Keep this file secure and never commit it to version control
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print(f"\n✅ API key saved to {env_file}")
    print("🎉 Setup complete! You can now run 'python app.py'")
    
    # Test the API key
    print("\n🧪 Testing API key...")
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        
        # Test with a simple request
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": "Hello, test message"}],
            model="llama-3.1-8b-instant",
            max_tokens=10
        )
        
        print("✅ API key is valid and working!")
        print(f"Test response: {response.choices[0].message.content}")
        
    except Exception as e:
        print(f"❌ API key test failed: {e}")
        print("Please check your API key and try again.")

if __name__ == "__main__":
    setup_groq_api()
