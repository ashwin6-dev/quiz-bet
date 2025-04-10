from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
# from sentence_transformers import SentenceTransformer

app = FastAPI()

"""
model_name = "all-MiniLM-L6-v2"
try:
    model = SentenceTransformer(model_name)
except Exception as e:
    raise RuntimeError(f"Error loading embedding model '{model_name}': {e}")
"""

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    text: str
    embedding: List[float]

@app.post("/embed", response_model=EmbedResponse)
async def embed_text(request_data: EmbedRequest):
    text = request_data.text
    try:
        embedding = [0, 0, 0]
        return EmbedResponse(text=text, embedding=embedding)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {e}")