# Fichier: backend/app/schemas/dashboard.py
from pydantic import BaseModel
from typing import List

class KpiData(BaseModel):
    attendance_rate: float
    overtime_hours_month: float
    late_alerts_week: int

class TopLateEmployee(BaseModel):
    first_name: str
    last_name: str
    late_count: int

class DashboardData(BaseModel):
    kpis: KpiData
    top_late_employees: List[TopLateEmployee]