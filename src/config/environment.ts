interface Config {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  paypal: {
    clientId: string;
  };
  pokemonTcg: {
    apiKey: string;
  };
  stripe: {
    publicKey: string;
  };
  isDevelopment: boolean;
}

const config: Config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  },
  pokemonTcg: {
    apiKey: import.meta.env.VITE_POKEMON_TCG_API_KEY,
  },
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  },
  isDevelopment: import.meta.env.VITE_DEV_MODE === 'true',
};

// Validation des configurations requises
const validateConfig = () => {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_PAYPAL_CLIENT_ID',
    'VITE_POKEMON_TCG_API_KEY',
    'VITE_STRIPE_PUBLIC_KEY',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

// Valider la configuration au démarrage de l'application
validateConfig();

export default config;
