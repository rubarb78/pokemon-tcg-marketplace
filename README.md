# Pokemon TCG Marketplace

Application de marché pour les cartes Pokémon avec authentification, blog communautaire et paiements PayPal.

## Fonctionnalités

- Authentification (Email + Google)
- Blog communautaire
- Marketplace de cartes
- Intégration PayPal
- Gestion de collection

## Installation

1. Clonez le dépôt
2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` avec vos clés API :
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

4. Lancez l'application en développement :
```bash
npm run dev
```

## Technologies utilisées

- React + TypeScript
- Vite
- Material-UI
- Firebase (Auth + Firestore)
- PayPal SDK
- React Router

## Structure du projet

```
src/
  ├── components/     # Composants réutilisables
  ├── hooks/         # Hooks personnalisés
  ├── pages/         # Pages de l'application
  ├── services/      # Services (Firebase, API)
  ├── App.tsx        # Composant principal
  └── main.tsx       # Point d'entrée
```

## Déploiement

1. Construisez l'application :
```bash
npm run build
```

2. Déployez sur votre hébergeur préféré (Netlify, Vercel, etc.)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
