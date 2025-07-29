# Fichier: backend/app/models/organization.py
import uuid
from datetime import datetime

from app.db.base import Base
from sqlalchemy import Column, Date, DateTime, ForeignKey, String, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class Department(Base):
    __tablename__ = "departments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    employees = relationship("Employee", back_populates="department")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(
        String(100), nullable=False, unique=True, comment="e.g., 'Standard 9h-18h'"
    )
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    break_start_time = Column(Time, default="12:30:00")
    break_end_time = Column(Time, default="14:30:00")

    # Relationships
    employees = relationship("Employee", back_populates="schedule")


class Employee(Base):
    __tablename__ = "employees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
        comment="Matricule de l'employé",
    )
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    hire_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Foreign Keys
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        unique=True,
        nullable=True,
        comment="Lien vers le compte utilisateur pour la connexion",
    )
    department_id = Column(
        UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True
    )
    schedule_id = Column(UUID(as_uuid=True), ForeignKey("schedules.id"), nullable=True)

    # Relationships
    user = relationship("User", back_populates="employee")
    department = relationship("Department", back_populates="employees")
    schedule = relationship("Schedule", back_populates="employees")
    attendance_entries = relationship(
        "AttendanceEntry", back_populates="employee", cascade="all, delete-orphan"
    )
    work_sessions = relationship(
        "WorkSession", back_populates="employee", cascade="all, delete-orphan"
    )
    leave_requests = relationship(
        "LeaveRequest", back_populates="employee", cascade="all, delete-orphan"
    )
