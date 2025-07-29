# Fichier: backend/app/models/attendance.py
import enum
import uuid
from datetime import datetime

from app.db.base import Base
from sqlalchemy import BigInteger, Column, Date, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship


class AttendanceRawImport(Base):
    __tablename__ = "attendance_raw_imports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_name = Column(String(255), nullable=False)
    storage_path = Column(
        String(512), nullable=False, comment="Path to original file in S3/MinIO"
    )
    status = Column(
        String(50),
        nullable=False,
        default="PENDING",
        comment="PENDING, PROCESSING, COMPLETED, FAILED",
    )
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processing_log = Column(Text, nullable=True)

    # Foreign Keys
    uploaded_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    # Relationships
    uploaded_by = relationship("User", back_populates="uploads")
    entries = relationship(
        "AttendanceEntry", back_populates="raw_import", cascade="all, delete-orphan"
    )


class AttendanceEntry(Base):
    __tablename__ = "attendance_entries"

    class EntryType(str, enum.Enum):
        IN = "IN"
        OUT = "OUT"

    id = Column(BigInteger, primary_key=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    entry_type = Column(
        SQLAlchemyEnum(EntryType, name="entry_type_enum"), nullable=False
    )

    # Foreign Keys
    employee_id = Column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, index=True
    )
    raw_import_id = Column(
        UUID(as_uuid=True), ForeignKey("attendance_raw_imports.id"), nullable=True
    )

    # Relationships
    employee = relationship("Employee", back_populates="attendance_entries")
    raw_import = relationship("AttendanceRawImport", back_populates="entries")


class WorkSession(Base):
    __tablename__ = "work_sessions"

    class SessionStatus(str, enum.Enum):
        ON_TIME = "ON_TIME"
        LATE = "LATE"
        ABSENT = "ABSENT"
        ON_LEAVE = "ON_LEAVE"
        HOLIDAY = "HOLIDAY"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_date = Column(Date, nullable=False, index=True)
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)
    worked_hours_seconds = Column(BigInteger, default=0)
    overtime_seconds = Column(BigInteger, default=0)
    break_deduction_seconds = Column(BigInteger, default=0)
    status = Column(
        SQLAlchemyEnum(SessionStatus, name="session_status_enum"), nullable=False
    )
    notes = Column(Text, nullable=True)

    # Foreign Keys
    employee_id = Column(
        UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False, index=True
    )

    # Relationships
    employee = relationship("Employee", back_populates="work_sessions")


class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    class LeaveStatus(str, enum.Enum):
        PENDING = "PENDING"
        APPROVED = "APPROVED"
        REJECTED = "REJECTED"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(
        SQLAlchemyEnum(LeaveStatus, name="leave_status_enum"),
        nullable=False,
        default="PENDING",
        index=True,
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Foreign Keys
    employee_id = Column(UUID(as_uuid=True), ForeignKey("employees.id"), nullable=False)
    requestor_user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    approver_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Relationships
    employee = relationship("Employee", back_populates="leave_requests")
    approver = relationship(
        "User", back_populates="approved_leaves", foreign_keys=[approver_user_id]
    )


class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    date = Column(Date, nullable=False, unique=True)


class AppParameter(Base):
    __tablename__ = "app_parameters"

    key = Column(String(100), primary_key=True)
    value = Column(JSONB, nullable=False)
    description = Column(Text, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True)
    action = Column(String(255), nullable=False, comment="e.g., 'LOGIN', 'USER_CREATE'")
    target_resource = Column(
        String(100), nullable=True, comment="e.g., 'user', 'department'"
    )
    target_id = Column(String, nullable=True)
    details = Column(JSONB, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Foreign Keys
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
        comment="User who performed the action",
    )

    # Relationships
    user = relationship("User", back_populates="audit_logs")
