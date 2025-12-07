# 🚗 IBRA Services - Garage Management AI-Powered

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> Application de gestion de garage nouvelle génération avec intelligence artificielle - Mécanique, Taxi, Livraison & Climatisation

🌐 **[Demo Live](https://ibra-services-web-XXXXX.run.app)** | 📚 **[Documentation](CONTRIBUTING.md)** | 🚀 **[Déployer](CLOUD_RUN_DEPLOYMENT.md)**

---

## ✨ Fonctionnalités Révolutionnaires

### 🤖 Intelligence Artificielle
- **Chatbot 24/7**: Assistant virtuel qui répond aux questions, prend des RDV
- **Diagnostics IA**: Analyse automatique des symptômes véhicules
- **Prévisions**: Anticipe les besoins d'entretien avant les pannes
- **Analytics Prédictifs**: Prévoit revenus, pics d'activité, optimisations

### 📱 Progressive Web App
- **Mode Hors-Ligne**: Fonctionne sans internet
- **Installable**: Like une app native, sans app store
- **Push Notifications**: Alertes intelligentes en temps réel
- **Synchronisation Auto**: Données synchronisées automatiquement

### 💎 Programme de Fidélité
- **4 Niveaux VIP**: Bronze → Silver → Gold → Platinum
- **Points sur Chaque Service**: Gagnez à chaque visite
- **Boutique Récompenses**: Échangez contre services gratuits
- **Parrainage**: 300 points pour vous + votre ami

### 🚗 Passeport Véhicule Digital
- **Historique Complet**: Tous les services documentés
- **QR Code**: Accès instantané via scan
- **PDF Professionnel**: Téléchargeable et partageable
- **Valeur Revente**: Augmente la valeur du véhicule de 15-20%

### 📊 Analytics Avancés
- **Tableau de Bord**: Métriques en temps réel
- **Graphiques Interactifs**: Visualisation des données
- **Insights Clients**: LTV, rétention, ROI marketing
- **Prévisions IA**: Projections revenus et tendances

### 💼 Gestion Complète
- **Rendez-vous**: Système de booking en ligne
- **Facturation**: Génération PDF automatique
- **Soumissions**: Workflow d'approbation client
- **Inventaire**: Gestion des pièces et stock
- **Personnel**: Gestion des techniciens
- **Accounting**: Revenus, dépenses, profits

---

## 🚀 Démarrage Rapide

### Prérequis
```bash
Node.js 18+
PostgreSQL 14+
npm ou yarn
```

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-org/ibra-services.git
cd ibra-services

# Installer dépendances
npm install

# Configuration environnement
cp .env.example .env
cp server/.env.example server/.env

# Éditer les fichiers .env avec vos valeurs
```

### Configuration Base de Données

```bash
# Créer la base de données
createdb garagepilot

# Exécuter le schema
psql -d garagepilot -f server/src/db/schema.sql
```

### Lancer en Développement

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend  
cd client
npm run dev
```

Application disponible sur: `http://localhost:3000`
API disponible sur: `http://localhost:3001`

---

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests avec UI
npm run test:ui

# Coverage
npm run test:coverage

# Linting
npm run lint

# Format code
npm run format
```

---

## ☁️ Déploiement Cloud Run

### Déploiement Automatique (1 Commande!)

```bash
# Setup initial (première fois seulement)
bash scripts/setup-gcp.sh

# Déployer
bash scripts/deploy-cloud-run.sh
```

Voir [CLOUD_RUN_DEPLOYMENT.md](CLOUD_RUN_DEPLOYMENT.md) pour les détails

### GitHub Actions CI/CD

Push vers `main` → Déploiement automatique en production!

---

## 📂 Structure du Projet

```
IBRASERVICES-main/
├── client/                    # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── AIChatbot.tsx
│   │   │   ├── LoyaltyProgram.tsx
│   │   │   ├── AdvancedAnalytics.tsx
│   │   │   └── DigitalVehiclePassport.tsx
│   │   ├── contexts/          # React Context
│   │   ├── utils/             # Utilitaires
│   │   │   ├── errorHandler.ts
│   │   │   ├── performance.ts
│   │   │   ├── accessibility.ts
│   │   │   └── pushNotifications.ts
│   │   └── services/          # API Services
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   └── sw.js              # Service worker
│   └── package.json
│
├── server/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── db/
│   │   │   └── schema.sql     # Database schema
│   │   └── middleware/
│   └── package.json
│
├── scripts/                   # Scripts déploiement
│   ├── deploy-cloud-run.sh
│   └── setup-gcp.sh
│
├── .github/workflows/         # CI/CD
│   └── deploy-production.yml
│
├── utils/                     # Utilitaires partagés
├── components/                # Composants partagés
├── CONTRIBUTING.md            # Guide contribution
└── CLOUD_RUN_DEPLOYMENT.md    # Guide déploiement
```

---

## 🎯 Technologies Utilisées

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Vitest** - Testing
- **React i18next** - Internationalisation

### Backend
- **Node.js 18+** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication

### AI & Cloud
- **Google Gemini AI** - Chatbot & diagnostics
- **Cloud Run** - Hosting
- **Cloud SQL** - Database production
- **Secret Manager** - Secrets management

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - Containerization
- **bash** - Automation scripts

---

## 🌟 Fonctionnalités en Détail

### Chatbot IA
Répond automatiquement en français 24/7 aux questions sur:
- Tarifs des services
- Prise de rendez-vous
- Horaires d'ouverture
- Services taxi/livraison/climatisation
- Urgences

### PWA & Mode Offline
- Fonctionne 100% offline
- Cache intelligent
- Synchronisation automatique
- Notifications push
- Installable sur mobile/desktop

### Loyalty Program
- Points automatiques sur chaque facture
- 4 niveaux: Bronze (0-500), Silver (500-2000), Gold (2000-5000), Platinum (5000+)
- Récompenses: services gratuits, crédits, priorité VIP
- Programme de parrainage

### Digital Passport
- Historique complet d'entretien
- QR code pour partage instantané
- PDF professionnel
- Augmente valeur de revente

---

## 📊 Performance & Qualité

- ✅ **TypeScript Strict Mode**: Type safety garantie
- ✅ **ESLint + Prettier**: Code quality automatique
- ✅ **80%+ Test Coverage**: Qualité vérifiée
- ✅ **WCAG AA Compliant**: Accessible à tous
- ✅ **PWA Score 95+**: Performance optimale
- ✅ **Lighthouse 90+**: Meilleurs pratiques web

---

## 💰 Coûts d'Opération

### Cloud Run (Trafic faible/moyen)
- Frontend: ~$0-5/mois (tier gratuit)
- Backend: ~$0-5/mois (tier gratuit)
- Cloud SQL: ~$10-15/mois (db-f1-micro)
- **Total: ~$10-20/mois** 🎉

### Scaling
- Auto-scaling: 0 → 10 instances
- Pay-per-use: Payez seulement ce que vous utilisez
- Pas de frais si pas de traffic

---

## 🤝 Contribution

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

### Quick Start
```bash
# Créer une branch
git checkout -b feature/ma-feature

# Faire vos changements
git add .
git commit -m "feat: ma nouvelle feature"

# Push et créer PR
git push origin feature/ma-feature
```

---

## 📝 Licence

MIT License - Voir [LICENSE](LICENSE)

---

## 📞 Support

- 📧 Email: support@ibra-services.ca
- 🐛 Issues: [GitHub Issues](https://github.com/votre-org/ibra-services/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/votre-org/ibra-services/discussions)

---

## 🎉 Crédits

Développé avec ❤️ pour les garages modernes du Québec

**IBRA Services** - 2374 Rue Royale, Trois-Rivières, QC
📞 (819) 979-1017 | 🌐 servicesibra.ca

---

<p align="center">
  <strong>⭐ Si ce projet vous plaît, donnez-lui une étoile sur GitHub!</strong>
</p>