from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
import torch

app = FastAPI()

model_name = "all-MiniLM-L6-v2"
try:
    model = SentenceTransformer(model_name)
except Exception as e:
    raise RuntimeError(f"Error loading embedding model '{model_name}': {e}")

adapter = torch.jit.load("../models/embed-finetuning/adapter.pt")

class EmbedRequest(BaseModel):
    text: str
    useAdapter: bool

class EmbedResponse(BaseModel):
    text: str
    embedding: List[float]

@app.post("/embed", response_model=EmbedResponse)
async def embed_text(request_data: EmbedRequest):
    text = request_data.text
    use_adapter = request_data.useAdapter

    try:
        embedding = model.encode(text)

        if use_adapter:
            embedding_tensor = torch.from_numpy(embedding)
            embedding = adapter(embedding_tensor)

        embedding = embedding.tolist()

        return EmbedResponse(text=text, embedding=embedding)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {e}")