import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { MONITORING_CONFIG } from '../../src/config/monitoring';

// Initialiser Firebase Admin si ce n'est pas déjà fait
if (!admin.apps.length) {
  admin.initializeApp();
}

interface PerformanceMetric {
  route: string;
  loadTime: number;
  metricType: 'pageLoad' | 'apiResponse' | 'renderTime' | 'databaseQuery';
  timestamp: admin.firestore.Timestamp;
  userId?: string;
}

interface ErrorLog {
  message: string;
  stack?: string;
  userId?: string;
  route?: string;
  timestamp: admin.firestore.Timestamp;
  metadata?: any;
}

// Stocker les métriques de performance
export const logPerformance = functions.https.onCall(async (data: PerformanceMetric, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentification requise'
    );
  }

  try {
    const metricDoc = {
      ...data,
      userId: context.auth.uid,
      timestamp: admin.firestore.Timestamp.now(),
    };

    await admin.firestore().collection('performance').add(metricDoc);

    // Vérifier si le temps dépasse le seuil configuré
    const threshold = MONITORING_CONFIG.performance.thresholds[data.metricType];
    if (data.loadTime > threshold) {
      await admin.firestore().collection('alerts').add({
        type: 'performance',
        severity: data.loadTime > threshold * 2 ? 'critical' : 'warning',
        message: `Performance dégradée détectée pour ${data.metricType}`,
        details: {
          ...metricDoc,
          threshold,
          exceedBy: `${Math.round((data.loadTime - threshold) / threshold * 100)}%`
        },
        timestamp: admin.firestore.Timestamp.now(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des métriques:', error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'enregistrement des métriques');
  }
});

// Stocker les logs d'erreur
export const logError = functions.https.onCall(async (data: ErrorLog, context) => {
  try {
    const errorDoc = {
      ...data,
      userId: context.auth?.uid,
      timestamp: admin.firestore.Timestamp.now(),
    };

    await admin.firestore().collection('errors').add(errorDoc);

    // Vérifier si c'est une erreur critique selon les patterns configurés
    const isCritical = MONITORING_CONFIG.errors.patterns.some(pattern => 
      data.message.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isCritical) {
      // Compter les erreurs similaires dans la fenêtre de temps configurée
      const timeWindow = MONITORING_CONFIG.errors.critical.timeWindow;
      const threshold = MONITORING_CONFIG.errors.critical.threshold;
      
      const similarErrors = await admin
        .firestore()
        .collection('errors')
        .where('message', '==', data.message)
        .where('timestamp', '>', admin.firestore.Timestamp.fromMillis(Date.now() - timeWindow))
        .get();

      if (similarErrors.size >= threshold) {
        await admin.firestore().collection('alerts').add({
          type: 'error',
          severity: 'critical',
          message: 'Erreur critique détectée',
          details: {
            ...errorDoc,
            similarErrorsCount: similarErrors.size,
            timeWindow: `${timeWindow / 60000} minutes`
          },
          timestamp: admin.firestore.Timestamp.now(),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'erreur:', error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'enregistrement de l\'erreur');
  }
});

// Nettoyer les anciennes données de monitoring
export const cleanupOldMonitoringData = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const retentionPeriod = MONITORING_CONFIG.performance.intervals.cleanup;
    const cutoffDate = new admin.firestore.Timestamp(
      now.seconds - Math.floor(retentionPeriod / 1000),
      now.nanoseconds
    );

    // Nettoyer les métriques de performance
    const oldPerformanceQuery = admin
      .firestore()
      .collection('performance')
      .where('timestamp', '<', cutoffDate)
      .limit(500);

    // Nettoyer les logs d'erreur
    const oldErrorsQuery = admin
      .firestore()
      .collection('errors')
      .where('timestamp', '<', cutoffDate)
      .limit(500);

    try {
      // Supprimer les anciennes métriques de performance
      const oldPerformanceDocs = await oldPerformanceQuery.get();
      const performanceBatch = admin.firestore().batch();
      oldPerformanceDocs.docs.forEach(doc => {
        performanceBatch.delete(doc.ref);
      });
      await performanceBatch.commit();

      // Supprimer les anciens logs d'erreur
      const oldErrorDocs = await oldErrorsQuery.get();
      const errorBatch = admin.firestore().batch();
      oldErrorDocs.docs.forEach(doc => {
        errorBatch.delete(doc.ref);
      });
      await errorBatch.commit();

      console.log(`Nettoyage terminé: ${oldPerformanceDocs.size} métriques de performance et ${oldErrorDocs.size} logs d'erreur supprimés`);
      return null;
    } catch (error) {
      console.error('Erreur lors du nettoyage des données:', error);
      return null;
    }
});
