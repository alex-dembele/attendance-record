# Fichier: backend/app/db/base.py

# La ligne ci-dessous est la correction.
# On passe de "from core.config..." à "from app.core.config..."
from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine(str(settings.DATABASE_URL), pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
