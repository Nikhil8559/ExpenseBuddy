from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date
from typing import Optional

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ExpenseBuddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://*.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/expenses", response_model=schemas.ExpenseResponse, status_code=201)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.get("/expenses/summary", response_model=schemas.SummaryResponse)
def get_summary(db: Session = Depends(get_db)):
    today = date.today()
    year, month = today.year, today.month

    rows = (
        db.query(models.Expense.category, func.sum(models.Expense.amount).label("total"))
        .filter(
            extract("year", models.Expense.date) == year,
            extract("month", models.Expense.date) == month,
        )
        .group_by(models.Expense.category)
        .all()
    )

    breakdown = [schemas.CategoryBreakdown(category=r.category, total=round(r.total, 2)) for r in rows]
    total = round(sum(b.total for b in breakdown), 2)

    return schemas.SummaryResponse(
        month=today.strftime("%B %Y"),
        total=total,
        breakdown=breakdown,
    )


@app.get("/expenses", response_model=list[schemas.ExpenseResponse])
def list_expenses(
    category: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Expense)
    if category:
        query = query.filter(models.Expense.category == category)
    if start_date:
        query = query.filter(models.Expense.date >= start_date)
    if end_date:
        query = query.filter(models.Expense.date <= end_date)
    return query.order_by(models.Expense.date.desc()).all()


@app.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
