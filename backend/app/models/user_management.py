# Fichier: backend/app/models/user_management.py
import uuid
from datetime import datetime

from app.db.base import Base
from sqlalchemy import JSON, Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship


class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(
        String(50),
        nullable=False,
        unique=True,
        comment="e.g., 'ADMIN', 'RH', 'MANAGER', 'EMPLOYEE'",
    )
    permissions = Column(
        JSON, nullable=True, comment="Permissions specific to the role"
    )

    # Relationships
    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Foreign Keys
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id"), nullable=False)

    # Relationships
    role = relationship("Role", back_populates="users")
    employee = relationship(
        "Employee", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    uploads = relationship("AttendanceRawImport", back_populates="uploaded_by")
    approved_leaves = relationship(
        "LeaveRequest",
        back_populates="approver",
        foreign_keys="[LeaveRequest.approver_user_id]",
    )
    audit_logs = relationship("AuditLog", back_populates="user")
