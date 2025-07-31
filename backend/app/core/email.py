# Fichier: backend/app/core/email.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

def send_email(to: str, subject: str, html_content: str):
    msg = MIMEMultipart()
    msg['From'] = settings.EMAILS_FROM_EMAIL
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(html_content, 'html'))

    # Connexion sécurisée au serveur SMTP
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()  # Activer la sécurité TLS
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)