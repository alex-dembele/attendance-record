from pydantic import BaseModel
from typing import Any

class ParameterRead(BaseModel):
    key: str
    value: Any
    description: str | None = None
    class Config:
        from_attributes = True