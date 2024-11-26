import { logEvent } from 'firebase/analytics';
import { getAnalytics } from '../config/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface Alert {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
  timestamp: Date;
}

class AlertService {
  private readonly analytics = getAnalytics();
  private readonly functions = getFunctions();
  private readonly sendAlertEmail = httpsCallable(this.functions, 'sendAlertEmail');
  private readonly sendSlackAlert = httpsCallable(this.functions, 'sendSlackAlert');

  // Seuils d'alerte pour différentes métriques
  private readonly thresholds = {
    errorRate: {
      medium: 5, // 5 erreurs par minute
      high: 10, // 10 erreurs par minute
      critical: 20, // 20 erreurs par minute
    },
    responseTime: {
      medium: 1000, // 1 seconde
      high: 3000, // 3 secondes
      critical: 5000, // 5 secondes
    },
    failedTransactions: {
      medium: 3, // 3 transactions échouées par heure
      high: 5, // 5 transactions échouées par heure
      critical: 10, // 10 transactions échouées par heure
    },
  };

  // File d'attente pour le regroupement des alertes
  private alertQueue: Alert[] = [];
  private readonly QUEUE_FLUSH_INTERVAL = 60000; // 1 minute

  constructor() {
    // Initialiser le flush périodique de la file d'attente
    setInterval(() => this.flushAlertQueue(), this.QUEUE_FLUSH_INTERVAL);
  }

  public async sendAlert(
    type: string,
    message: string,
    severity: Alert['severity'],
    metadata?: Record<string, any>
  ) {
    const alert: Alert = {
      type,
      message,
      severity,
      metadata,
      timestamp: new Date(),
    };

    // Ajouter à la file d'attente
    this.alertQueue.push(alert);

    // Log dans Firebase Analytics
    logEvent(this.analytics, 'alert_triggered', {
      alert_type: type,
      alert_severity: severity,
      ...metadata,
    });

    // Envoyer immédiatement les alertes critiques
    if (severity === 'critical') {
      await this.processAlert(alert);
    }
  }

  private async flushAlertQueue() {
    if (this.alertQueue.length === 0) return;

    // Regrouper les alertes par type
    const groupedAlerts = this.groupAlerts(this.alertQueue);

    // Traiter chaque groupe d'alertes
    for (const [type, alerts] of Object.entries(groupedAlerts)) {
      await this.processBatchAlerts(type, alerts);
    }

    // Vider la file d'attente
    this.alertQueue = [];
  }

  private groupAlerts(alerts: Alert[]): Record<string, Alert[]> {
    return alerts.reduce((acc, alert) => {
      if (!acc[alert.type]) {
        acc[alert.type] = [];
      }
      acc[alert.type].push(alert);
      return acc;
    }, {} as Record<string, Alert[]>);
  }

  private async processBatchAlerts(type: string, alerts: Alert[]) {
    const highestSeverity = this.getHighestSeverity(alerts);
    const summary = this.createAlertSummary(type, alerts);

    if (highestSeverity === 'critical' || highestSeverity === 'high') {
      await Promise.all([
        this.sendSlackAlert({ summary }),
        this.sendAlertEmail({ summary }),
      ]);
    } else if (highestSeverity === 'medium') {
      await this.sendSlackAlert({ summary });
    }
  }

  private async processAlert(alert: Alert) {
    const summary = `[${alert.severity.toUpperCase()}] ${alert.type}: ${alert.message}`;

    switch (alert.severity) {
      case 'critical':
        await Promise.all([
          this.sendSlackAlert({ summary, metadata: alert.metadata }),
          this.sendAlertEmail({ summary, metadata: alert.metadata }),
        ]);
        break;
      case 'high':
        await this.sendSlackAlert({ summary, metadata: alert.metadata });
        break;
      default:
        // Log only for low and medium severity
        console.warn('Alert:', summary, alert.metadata);
    }
  }

  private getHighestSeverity(alerts: Alert[]): Alert['severity'] {
    const severityOrder = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return alerts.reduce((highest, alert) => {
      return severityOrder[alert.severity] > severityOrder[highest]
        ? alert.severity
        : highest;
    }, 'low' as Alert['severity']);
  }

  private createAlertSummary(type: string, alerts: Alert[]): string {
    const count = alerts.length;
    const highestSeverity = this.getHighestSeverity(alerts);
    
    return `[${highestSeverity.toUpperCase()}] ${count} ${type} alerts in the last minute\n` +
      alerts.map(a => `- ${a.message}`).join('\n');
  }

  // Méthodes utilitaires pour vérifier les seuils
  public checkErrorRate(errorsPerMinute: number) {
    if (errorsPerMinute >= this.thresholds.errorRate.critical) {
      this.sendAlert('error_rate', 
        `Error rate critical: ${errorsPerMinute} errors/minute`, 
        'critical',
        { errorsPerMinute }
      );
    } else if (errorsPerMinute >= this.thresholds.errorRate.high) {
      this.sendAlert('error_rate',
        `Error rate high: ${errorsPerMinute} errors/minute`,
        'high',
        { errorsPerMinute }
      );
    }
  }

  public checkResponseTime(responseTime: number, endpoint: string) {
    if (responseTime >= this.thresholds.responseTime.critical) {
      this.sendAlert('response_time',
        `Response time critical for ${endpoint}: ${responseTime}ms`,
        'critical',
        { responseTime, endpoint }
      );
    } else if (responseTime >= this.thresholds.responseTime.high) {
      this.sendAlert('response_time',
        `Response time high for ${endpoint}: ${responseTime}ms`,
        'high',
        { responseTime, endpoint }
      );
    }
  }

  public checkFailedTransactions(failedCount: number) {
    if (failedCount >= this.thresholds.failedTransactions.critical) {
      this.sendAlert('failed_transactions',
        `Critical number of failed transactions: ${failedCount} in the last hour`,
        'critical',
        { failedCount }
      );
    } else if (failedCount >= this.thresholds.failedTransactions.high) {
      this.sendAlert('failed_transactions',
        `High number of failed transactions: ${failedCount} in the last hour`,
        'high',
        { failedCount }
      );
    }
  }
}

export const alerts = new AlertService();
