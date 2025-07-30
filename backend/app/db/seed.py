# Fichier: backend/app/db/seed.py

from sqlalchemy.orm import Session
from pydantic import EmailStr

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import SessionLocal
from app.models.user_management import User, Role
from app.models.organization import Employee
from app.models.attendance import AppParameter

def seed_db(db: Session):
    """
    Peuple la base de données avec les données initiales (rôles, utilisateurs, employés, paramètres).
    """
    print("Seeding database roles...")
    # Créer les rôles
    admin_role = db.query(Role).filter(Role.name == "ADMIN").first()
    if not admin_role:
        admin_role = Role(name="ADMIN", permissions={"users": ["*"], "attendance": ["*"]})
        db.add(admin_role)

    rh_role = db.query(Role).filter(Role.name == "RH").first()
    if not rh_role:
        rh_role = Role(name="RH", permissions={"attendance": ["read", "export"], "leaves": ["*"]})
        db.add(rh_role)

    employee_role = db.query(Role).filter(Role.name == "EMPLOYEE").first()
    if not employee_role:
        employee_role = Role(name="EMPLOYEE", permissions={"attendance": ["read_own"], "leaves": ["create", "read_own"]})
        db.add(employee_role)
    
    db.commit()
    
    print("Seeding admin user...")
    # Créer le premier super-utilisateur (ADMIN)
    admin_user = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
    if not admin_user:
        hashed_password = get_password_hash(settings.FIRST_SUPERUSER_PASSWORD)
        new_admin_user = User(
            email=settings.FIRST_SUPERUSER_EMAIL,
            hashed_password=hashed_password,
            role_id=admin_role.id,
            is_active=True,
        )
        db.add(new_admin_user)
        db.commit()
        print(f"Admin user '{settings.FIRST_SUPERUSER_EMAIL}' created.")
    else:
        print("Admin user already exists.")

    print("Seeding RH user...")
    # Créer un utilisateur RH de test
    rh_user_email = "rh@example.com"
    rh_user = db.query(User).filter(User.email == rh_user_email).first()
    if not rh_user:
        hashed_password = get_password_hash("rh_password")
        new_rh_user = User(
            email=rh_user_email,
            hashed_password=hashed_password,
            role_id=rh_role.id,
            is_active=True,
        )
        db.add(new_rh_user)
        db.commit()
        print(f"RH user '{rh_user_email}' created.")
    else:
        print("RH user already exists.")

    print("Seeding employees...")
    # Liste des employés de test (ID, Prénom, Nom)
    employees_to_create = [
        ('5', 'EDDY JOEL', 'TCHOUSSE LONKENG'),
        ('8', 'JOSIAS', 'NGNIEUDOP WANDJI'),
        ('18', 'Joviale', 'NZEMBONG KEMZO'),
        ('30', 'ALEXANDRE', 'DEMBELE'),
        ('41', 'EMILIE GRACE', 'APIEBOVE NGHAP'),
        ('50', 'INES EUGENIE', 'MBEYOO'),
        ('91', 'Duclair', 'DEUGOUE'),
    ]

    for emp_id, first_name, last_name in employees_to_create:
        employee = db.query(Employee).filter(Employee.employee_id == emp_id).first()
        if not employee:
            new_employee = Employee(
                employee_id=emp_id,
                first_name=first_name,
                last_name=last_name
            )
            db.add(new_employee)
            print(f"Employee {first_name} {last_name} (ID: {emp_id}) created.")
    
    db.commit()
    print("Employees seeded.")
    
    print("Seeding employee user...")
    # Lier à l'employé avec l'ID '30' (Alexandre DEMBELE)
    employee_record = db.query(Employee).filter(Employee.employee_id == '30').first()
    if employee_record:
        employee_user = db.query(User).filter(User.email == "employe@example.com").first()
        if not employee_user:
            hashed_password = get_password_hash("password")
            new_employee_user = User(
                email="employe@example.com",
                hashed_password=hashed_password,
                role_id=employee_role.id,
                is_active=True,
            )
            db.add(new_employee_user)
            db.commit() # Commit pour que new_employee_user.id soit disponible
            
            # Lier le user à l'employee
            employee_record.user_id = new_employee_user.id
            db.commit()
            print("Employee user 'employe@example.com' created and linked.")
        else:
            print("Employee user already exists.")
    else:
        print("Could not find employee with ID '30' to link user account.")

    print("Seeding app parameters...")
    default_params = {
        "LATE_TOLERANCE_MINUTES": {"value": 10, "description": "Tolérance de retard en minutes"},
        "DEFAULT_SCHEDULE_START": {"value": "08:30:00", "description": "Heure de début de travail par défaut"},
        "DEFAULT_SCHEDULE_END": {"value": "17:30:00", "description": "Heure de fin de travail par défaut"}
    }
    for key, data in default_params.items():
        param = db.query(AppParameter).filter(AppParameter.key == key).first()
        if not param:
            db_param = AppParameter(key=key, value=data['value'], description=data['description'])
            db.add(db_param)
    db.commit()
    print("App parameters seeded.")


if __name__ == "__main__":
    print("Starting database seeding...")
    db = SessionLocal()
    seed_db(db)
    print("Database seeding completed successfully.")