from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional


class ExpenseCreate(BaseModel):
    amount: float
    category: str
    date: date
    description: Optional[str] = ""

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Amount must be positive")
        return v

    @field_validator("category")
    @classmethod
    def category_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Category must not be empty")
        return v.strip()


class ExpenseResponse(BaseModel):
    id: int
    amount: float
    category: str
    date: date
    description: str

    model_config = {"from_attributes": True}


class CategoryBreakdown(BaseModel):
    category: str
    total: float


class SummaryResponse(BaseModel):
    month: str
    total: float
    breakdown: list[CategoryBreakdown]
