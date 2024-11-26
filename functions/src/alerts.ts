import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { WebClient } from '@slack/web-api';
import { MONITORING_CONFIG } from '../../src/config/monitoring';

// Initialiser Slack
const slack = new WebClient(functions.config().slack.token);

// Initialiser Nodemailer
const transporter = nodemailer.createTransport({
  host: functions.config().email.host,
  port: 587,
  secure: false,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

interface AlertData {
  type: 'critical' | 'performance' | 'security';
  message: string;
  details?: any;
  metadata?: {
    metric?: string;
    value?: number | string;
  };
}

// Formater le message Slack
function formatSlackMessage(data: AlertData): string {
  const template = MONITORING_CONFIG.alerts.slack.templates[data.type];
  return template
    .replace('{message}', data.message)
    .replace('{details}', JSON.stringify(data.details, null, 2))
    .replace('{metric}', data.metadata?.metric || '')
    .replace('{value}', data.metadata?.value?.toString() || '');
}

// Formater l'email
function formatEmail(data: AlertData) {
  const template = MONITORING_CONFIG.alerts.email.templates;
  const date = new Date().toLocaleString('fr-FR');
  
  return {
    subject: template.subject
      .replace('{type}', data.type.toUpperCase())
      .replace('{summary}', data.message),
    
    html: template.body
      .replace('{title}', `Alerte ${data.type.toUpperCase()}`)
      .replace('{type}', data.type)
      .replace('{date}', date)
      .replace('{description}', data.message)
      .replace('{details}', JSON.stringify(data.details, null, 2))
  };
}

export const sendAlertEmail = functions.https.onCall(async (data: AlertData, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentification requise'
    );
  }

  try {
    const recipients = MONITORING_CONFIG.alerts.email.recipients[data.type];
    const { subject, html } = formatEmail(data);

    const mailOptions = {
      from: functions.config().email.from,
      to: recipients.join(','),
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi de l\'email');
  }
});

export const sendSlackAlert = functions.https.onCall(async (data: AlertData, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Authentification requise'
    );
  }

  try {
    const channel = MONITORING_CONFIG.alerts.slack.channels[data.type];
    const message = formatSlackMessage(data);

    await slack.chat.postMessage({
      channel,
      text: message,
      mrkdwn: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'alerte Slack:', error);
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'envoi de l\'alerte Slack');
  }
});

// Monitorer les erreurs fréquentes
export const monitorErrors = functions.firestore
  .document('errors/{errorId}')
  .onCreate(async (snap, context) => {
    const error = snap.data();
    const now = admin.firestore.Timestamp.now();
    const timeWindow = MONITORING_CONFIG.errors.critical.timeWindow;
    const threshold = MONITORING_CONFIG.errors.critical.threshold;

    const recentErrors = await admin
      .firestore()
      .collection('errors')
      .where('timestamp', '>', admin.firestore.Timestamp.fromMillis(now.toMillis() - timeWindow))
      .get();

    if (recentErrors.size >= threshold) {
      const alertData: AlertData = {
        type: 'critical',
        message: `${recentErrors.size} erreurs détectées dans les dernières ${timeWindow / 60000} minutes`,
        details: {
          lastError: error,
          errorCount: recentErrors.size,
          timeWindow: `${timeWindow / 60000} minutes`,
        }
      };

      await Promise.all([
        sendSlackAlert.call(context, { data: alertData }),
        sendAlertEmail.call(context, { data: alertData })
      ]);
    }
});

// Monitorer les transactions échouées
export const monitorFailedTransactions = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const timeWindow = MONITORING_CONFIG.transactions.thresholds.timeWindow;
    const threshold = MONITORING_CONFIG.transactions.thresholds.failedCount;

    const failedTransactions = await admin
      .firestore()
      .collection('transactions')
      .where('status', '==', 'failed')
      .where('timestamp', '>', admin.firestore.Timestamp.fromMillis(now.toMillis() - timeWindow))
      .get();

    if (failedTransactions.size >= threshold) {
      const alertData: AlertData = {
        type: 'critical',
        message: `Nombre élevé de transactions échouées`,
        details: {
          failedCount: failedTransactions.size,
          timeWindow: `${timeWindow / 3600000} heure(s)`,
          threshold,
        }
      };

      await Promise.all([
        sendSlackAlert.call(context, { data: alertData }),
        sendAlertEmail.call(context, { data: alertData })
      ]);
    }
});
