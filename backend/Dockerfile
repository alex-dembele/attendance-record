# Fichier: backend/Dockerfile

# --- Stage 1: Builder ---
FROM python:3.12-slim-bookworm AS builder

WORKDIR /app

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends gcc build-essential

# Créer un environnement virtuel
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# --- Stage 2: Runner ---
FROM python:3.12-slim-bookworm AS runner

WORKDIR /app

# Copier l'environnement virtuel et le code de l'application
COPY --from=builder /opt/venv /opt/venv
COPY ./app /app/app

# Créer un utilisateur non-root pour la sécurité
RUN useradd --create-home appuser
USER appuser

# Activer l'environnement virtuel
ENV PATH="/opt/venv/bin:$PATH"

# Commande pour lancer l'application en production
# Utilise gunicorn comme serveur WSGI, plus robuste que uvicorn pour la prod
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-w", "4", "-b", "0.0.0.0:8000", "app.main:app"]