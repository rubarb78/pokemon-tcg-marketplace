import { useEffect, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { MONITORING_CONFIG } from '../config/monitoring';

interface PerformanceMetric {
  route: string;
  loadTime: number;
  metricType: keyof typeof MONITORING_CONFIG.performance.thresholds;
  timestamp: Date;
  userId?: string;
}

interface MonitoringHook {
  logPerformance: (metric: Omit<PerformanceMetric, 'timestamp'>) => Promise<void>;
  logError: (error: Error, metadata?: any) => Promise<void>;
  startMetric: (metricType: string) => () => void;
}

export const useMonitoring = (): MonitoringHook => {
  const functions = getFunctions();
  const logPerformanceFunction = httpsCallable(functions, 'logPerformance');
  const logErrorFunction = httpsCallable(functions, 'logError');

  // Fonction pour enregistrer une métrique de performance
  const logPerformance = useCallback(async (metric: Omit<PerformanceMetric, 'timestamp'>) => {
    try {
      await logPerformanceFunction({
        ...metric,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la métrique:', error);
    }
  }, [logPerformanceFunction]);

  // Fonction pour enregistrer une erreur
  const logError = useCallback(async (error: Error, metadata?: any) => {
    try {
      await logErrorFunction({
        message: error.message,
        stack: error.stack,
        metadata,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'erreur:', err);
    }
  }, [logErrorFunction]);

  // Fonction pour mesurer le temps d'exécution d'une opération
  const startMetric = useCallback((metricType: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      logPerformance({
        metricType: metricType as keyof typeof MONITORING_CONFIG.performance.thresholds,
        loadTime,
        route: window.location.pathname,
      });
    };
  }, [logPerformance]);

  // Intercepter les erreurs non gérées
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      logError(event.error, {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [logError]);

  return {
    logPerformance,
    logError,
    startMetric,
  };
};
