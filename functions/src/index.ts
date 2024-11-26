import * as admin from 'firebase-admin';
import * as alerts from './alerts';
import * as monitoring from './monitoring';

// Initialiser Firebase Admin
admin.initializeApp();

// Exporter les fonctions d'alerte
export const sendAlertEmail = alerts.sendAlertEmail;
export const sendSlackAlert = alerts.sendSlackAlert;
export const monitorErrors = alerts.monitorErrors;
export const monitorFailedTransactions = alerts.monitorFailedTransactions;

// Exporter les fonctions de monitoring
export const logPerformance = monitoring.logPerformance;
export const logError = monitoring.logError;
export const cleanupOldMonitoringData = monitoring.cleanupOldMonitoringData;
