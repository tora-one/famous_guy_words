from pydantic import BaseModel

class Words(BaseModel):
    id: int
    source: str
    writer: str
    quote: str
    category: str