# Pokémon TCG Marketplace

Application web de marketplace pour cartes Pokémon TCG développée avec React, TypeScript et Vite.

## État Actuel du Projet

### Fonctionnalités Principales
- Affichage des cartes avec animation recto-verso
- Intégration des cartes rares dans le marketplace principal
- Système d'authentification avec Firebase
- Gestion des favoris et du panier
- Interface responsive et moderne

### Stack Technique
- Frontend: React 18 avec TypeScript
- Build: Vite
- UI: Material-UI (MUI)
- State Management: Zustand
- Routing: React Router
- Animations: Framer Motion
- Backend: Firebase
- API: Pokemon TCG API

### Dépendances Principales
```json
{
  "@mui/material": "^5.x",
  "firebase": "^9.x",
  "react-router-dom": "^6.x",
  "pokemon-tcg-sdk-typescript": "^1.x",
  "axios": "^1.x",
  "zustand": "^4.x"
}
```

### Structure du Projet
```
pokemon-tcg-marketplace/
├── src/
│   ├── components/      # Composants React
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services (API, Firebase)
│   ├── hooks/          # Custom hooks
│   ├── types/          # Types TypeScript
│   ├── assets/         # Assets (images, styles)
│   └── App.tsx         # Composant principal
├── public/             # Assets publics
└── package.json        # Dépendances
```

## Installation et Démarrage

1. Cloner le projet
```bash
git clone https://github.com/rubarb78/pokemon-tcg-marketplace.git
cd pokemon-tcg-marketplace
```

2. Installer les dépendances
```bash
npm install
```

3. Démarrer en développement
```bash
npm run dev
```

4. Build et déploiement
```bash
npm run build
npm run deploy
```

## Points d'Attention
- Le déploiement Firebase nécessite un plan Blaze
- Les clés API doivent être configurées dans les variables d'environnement
- L'application est déployée sur GitHub Pages

## Prochaines Étapes
1. Finaliser l'intégration backend
2. Compléter l'intégration des paiements
3. Améliorer les performances
4. Ajouter des tests unitaires
5. Optimiser le chargement des ressources

## Liens Utiles
- [Site en production](https://rubarb78.github.io/pokemon-tcg-marketplace/)
- [Documentation Pokemon TCG API](https://docs.pokemontcg.io/)
- [Documentation Firebase](https://firebase.google.com/docs)
