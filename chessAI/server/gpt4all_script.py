import sys
import llama_cpp

def load_model(model_path):
    try:
        model = llama_cpp.Llama(model_path=model_path)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def generate_text(model, prompt, max_tokens=32, stop_tokens=["Q:", "\n"]):
    try:
        response = model.create_chat_completion(messages=[{
            "role":"user",
            "content": prompt
        }])
        output_text = response['choices'][0]['message']
        # output_text = response['choices'][0]['text']
        return output_text
    except Exception as e:
        print(f"Error generating text: {e}")
        return None

if __name__ == "__main__":
    model_path = "/Users/ryan/Library/Application Support/nomic.ai/GPT4All/Meta-Llama-3.1-8B-Instruct-128k-Q4_0.gguf"
    prompt = sys.argv[1]

    model = load_model(model_path)
    if model:
        output = generate_text(model, prompt)
        if output:
            print(output)