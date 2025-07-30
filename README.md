# Attendance-record 🚀

**Attendance-record** est une plateforme complète de gestion des présences des employés, conçue pour automatiser le suivi, générer des rapports et fournir une interface d'administration moderne et réactive.


## ✨ Fonctionnalités

- **Dashboard Analytique** : KPIs, graphiques de présence et de répartition des statuts.
- **Upload de Fichiers Intelligent** : Import de fichiers Excel/CSV depuis la pointeuse avec traitement asynchrone.
- **Calcul Automatique** : Calcul des heures travaillées, déduction des pauses, gestion des retards et absences.
- **Workflow de Permissions** : Système complet de demande et d'approbation des congés.
- **Gestion des Utilisateurs** : Création/suppression d'utilisateurs avec gestion des rôles (Admin, RH, Employé).
- **Centre de Contrôle** : Page de paramètres pour configurer les règles métier (tolérances, etc.).
- **Rapports par E-mail** : Envoi hebdomadaire et automatique d'un résumé aux RH.
- **Interface Moderne** : Design "glassmorphism", fond d'aurore animé, curseur "spotlight", et thème sombre/clair.

---

## 🛠️ Stack Technique

| Domaine | Outil |
| :--- | :--- |
| **Backend** | FastAPI (Python) |
| **Frontend** | Next.js (React, TypeScript), Tailwind CSS, Shadcn/UI |
| **Base de Données** | PostgreSQL |
| **Tâches de Fond** | Celery & Redis |
| **Conteneurisation** | Docker & Docker Compose |
| **CI/CD** | GitHub Actions |

---

## 🏁 Démarrage Rapide

Pour lancer l'intégralité du projet en environnement de développement.

**Prérequis :**
- Git
- Docker
- Docker Compose

### Lancement en 3 Commandes :

1.  **Clonez le dépôt :**
    ```bash
    git clone [https://github.com/votre-nom/attendance-record.git](https://github.com/votre-nom/attendance-record.git)
    cd attendance-record
    ```

2.  **Configurez l'environnement :**
    ```bash
    cp .env.example .env
    ```
    *(Ouvrez le fichier `.env` et assurez-vous que les variables vous conviennent)*

3.  **Lancez l'application avec Docker Compose :**
    ```bash
    docker-compose up --build -d
    ```

---

## 🌐 Services Disponibles

Une fois lancé, les services suivants sont accessibles :

- **Frontend (Application Principale)** : [http://localhost:3000](http://localhost:3000)
- **Backend (API)** : [http://localhost:8000](http://localhost:8000)
- **Documentation de l'API (Swagger)** : [http://localhost:8000/docs](http://localhost:8000/docs)
- **Interface E-mail (MailHog)** : [http://localhost:8025](http://localhost:8025)

---

## 🔑 Identifiants par Défaut

| Rôle | Email | Mot de Passe |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `changeme` |
| **RH** | `rh@example.com` | `rh_password` |
| **Employé** | `employe@example.com` | `password` |