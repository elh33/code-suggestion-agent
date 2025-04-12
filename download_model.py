import os
import argparse
import requests
import tqdm
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def download_model(model_name, model_file, download_dir):
    """Download a model from Hugging Face"""
    # Create download directory if it doesn't exist
    os.makedirs(download_dir, exist_ok=True)
    
    # Format the download URL
    download_url = f"https://huggingface.co/{model_name}/resolve/main/{model_file}"
    model_path = os.path.join(download_dir, model_file)
    
    # Check if model already exists
    if os.path.exists(model_path):
        print(f"Model already exists at {model_path}")
        size_mb = os.path.getsize(model_path) / (1024 * 1024)
        print(f"Size: {size_mb:.2f} MB")
        return model_path
    
    print(f"Downloading model from {download_url}")
    
    # Download with progress bar
    response = requests.get(download_url, stream=True)
    total_size = int(response.headers.get("content-length", 0))
    
    with open(model_path, "wb") as f, tqdm.tqdm(
        total=total_size,
        unit="B",
        unit_scale=True,
        desc=model_file
    ) as progress:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
                progress.update(len(chunk))
    
    print(f"Model downloaded to {model_path}")
    return model_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download a model from Hugging Face")
    parser.add_argument(
        "--model-name", 
        default=os.getenv("MODEL_NAME", "TheBloke/CodeLlama-7B-Instruct-GGUF"),
        help="Model name on Hugging Face"
    )
    parser.add_argument(
        "--model-file", 
        default=os.getenv("MODEL_FILE", "codellama-7b-instruct.Q4_K_M.gguf"),
        help="Model file name"
    )
    parser.add_argument(
        "--download-dir", 
        default=os.getenv("MODEL_DOWNLOAD_DIR", "D:/models"),
        help="Directory to download the model to"
    )
    
    args = parser.parse_args()
    
    download_model(args.model_name, args.model_file, args.download_dir)