import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

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
  'VITE_DEV_MODE'
];

function checkEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Le fichier ${path.basename(filePath)} n'existe pas`);
    return false;
  }

  const envContent = fs.readFileSync(filePath, 'utf8');
  const envVars = new Set(
    envContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0])
  );

  const missingVars = requiredEnvVars.filter(v => !envVars.has(v));
  
  if (missingVars.length > 0) {
    console.error(`❌ Variables manquantes dans ${path.basename(filePath)}:`);
    missingVars.forEach(v => console.error(`   - ${v}`));
    return false;
  }

  console.log(`✅ ${path.basename(filePath)} est correctement configuré`);
  return true;
}

function main() {
  console.log('🔍 Vérification des fichiers d\'environnement...\n');
  
  const envFiles = [
    path.join(rootDir, '.env'),
    path.join(rootDir, '.env.development'),
    path.join(rootDir, '.env.production')
  ];

  const results = envFiles.map(checkEnvFile);
  
  if (results.some(r => !r)) {
    console.error('\n❌ Certains fichiers d\'environnement ne sont pas correctement configurés');
    console.log('\n📖 Consultez DEPLOYMENT.md pour plus d\'informations sur la configuration');
    process.exit(1);
  }

  console.log('\n✅ Tous les fichiers d\'environnement sont correctement configurés');
}

main();
