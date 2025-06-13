from fastapi import APIRouter, HTTPException
from typing import List
from ..models.words import Words
import json
import os
from pathlib import Path

router = APIRouter(
    prefix="/api/words",
    tags=["words"],
)

@router.get("/{category}", response_model=List[Words])
async def get_words(category: str):
    print("★★★")
    # データディレクトリへのパスを構築
    current_dir = Path(__file__).parent.parent
    file_path = current_dir / "data" / "words.json"
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if category == "all":
            return data
        else:
            return [item for item in data if item["category"] == category]
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return []
    except Exception as e:
        print(f"Error reading file: {e}")
        raise HTTPException(status_code=500, detail=f"Error reading data: {str(e)}")

