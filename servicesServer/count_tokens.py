import sys
import json
import tiktoken

def count_tokens(text):
    # Usa el encoding 'cl100k_base', compatible con GPT-3.5-turbo
    encoding = tiktoken.get_encoding("cl100k_base")
    tokens = encoding.encode(text)
    return len(tokens)

if __name__ == "__main__":
    # Recibir texto desde la entrada estándar
    input_text = sys.stdin.read()
    text_data = json.loads(input_text)
    text = text_data.get("text", "")
    
    # Contar tokens
    token_count = count_tokens(text)
    
    # Devolver el resultado
    print(json.dumps({"tokenCount": token_count}))
