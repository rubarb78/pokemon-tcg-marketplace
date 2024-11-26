# Guide de Déploiement - Pokemon TCG Marketplace

## Configuration des Environnements

### 1. Création des Clés API de Production

#### Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet pour la production ou utilisez un projet existant
3. Dans les paramètres du projet, créez une nouvelle application web
4. Notez les clés de configuration :
   - `PROD_FIREBASE_API_KEY`
   - `PROD_FIREBASE_AUTH_DOMAIN`
   - `PROD_FIREBASE_PROJECT_ID`
   - `PROD_FIREBASE_STORAGE_BUCKET`
   - `PROD_FIREBASE_MESSAGING_SENDER_ID`
   - `PROD_FIREBASE_APP_ID`

#### PayPal
1. Connectez-vous à [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Créez une nouvelle application pour la production
3. Notez la clé `PROD_PAYPAL_CLIENT_ID`

#### Pokemon TCG API
1. Allez sur [Pokemon TCG Developer Portal](https://dev.pokemontcg.io/)
2. Créez une nouvelle clé API pour la production
3. Notez la clé `PROD_POKEMON_TCG_API_KEY`

#### Stripe
1. Connectez-vous à [Stripe Dashboard](https://dashboard.stripe.com/)
2. Dans les paramètres de l'API, récupérez votre clé publique de production
3. Notez la clé `PROD_STRIPE_PUBLIC_KEY`

### 2. Configuration du Déploiement

#### Option 1 : Vercel (Recommandé)
1. Connectez votre repository à Vercel
2. Dans les paramètres du projet, ajoutez les variables d'environnement :
   ```
   VITE_FIREBASE_API_KEY=${PROD_FIREBASE_API_KEY}
   VITE_FIREBASE_AUTH_DOMAIN=${PROD_FIREBASE_AUTH_DOMAIN}
   VITE_FIREBASE_PROJECT_ID=${PROD_FIREBASE_PROJECT_ID}
   VITE_FIREBASE_STORAGE_BUCKET=${PROD_FIREBASE_STORAGE_BUCKET}
   VITE_FIREBASE_MESSAGING_SENDER_ID=${PROD_FIREBASE_MESSAGING_SENDER_ID}
   VITE_FIREBASE_APP_ID=${PROD_FIREBASE_APP_ID}
   VITE_PAYPAL_CLIENT_ID=${PROD_PAYPAL_CLIENT_ID}
   VITE_POKEMON_TCG_API_KEY=${PROD_POKEMON_TCG_API_KEY}
   VITE_STRIPE_PUBLIC_KEY=${PROD_STRIPE_PUBLIC_KEY}
   VITE_DEV_MODE=false
   ```
3. Configurez la commande de build : `npm run build`
4. Configurez le répertoire de sortie : `dist`

#### Option 2 : Netlify
1. Connectez votre repository à Netlify
2. Dans Site settings > Build & deploy > Environment, ajoutez les mêmes variables d'environnement que ci-dessus
3. Configurez la commande de build : `npm run build`
4. Configurez le répertoire de publication : `dist`

### 3. Sécurité

#### Configuration de Firebase
1. Dans Firebase Console, configurez les règles de sécurité :
   - Limitez les domaines autorisés pour l'authentification
   - Configurez les règles Firestore pour limiter l'accès aux données
   - Activez la protection contre les abus

#### Configuration de l'API Pokemon TCG
1. Configurez des limites de taux d'utilisation
2. Restreignez l'origine des requêtes à votre domaine de production

#### Configuration de Stripe
1. Configurez les webhooks pour votre environnement de production
2. Activez la détection de fraude
3. Configurez les notifications de sécurité

## Déploiement

1. Assurez-vous que toutes les variables d'environnement sont configurées
2. Exécutez les tests : `npm test`
3. Créez un build de production : `npm run build`
4. Vérifiez le build localement : `npm run start`
5. Déployez via votre plateforme choisie (Vercel/Netlify)
6. Vérifiez les logs après le déploiement
7. Testez toutes les fonctionnalités sur l'environnement de production

## Maintenance

1. Surveillez les métriques de performance
2. Configurez des alertes pour :
   - Erreurs d'authentification inhabituelles
   - Pics d'utilisation de l'API
   - Transactions échouées
3. Effectuez des sauvegardes régulières des données
4. Planifiez des rotations régulières des clés API

## Contacts d'Urgence

- Support Firebase : [Firebase Support](https://firebase.google.com/support)
- Support PayPal : [PayPal Developer Support](https://developer.paypal.com/support)
- Support Stripe : [Stripe Support](https://support.stripe.com)
