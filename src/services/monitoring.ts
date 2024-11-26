import { Analytics, logEvent } from 'firebase/analytics';
import { FirebaseError } from 'firebase/app';
import { getAnalytics } from '../config/firebase';

interface ErrorReport {
  error: Error | FirebaseError;
  context?: Record<string, any>;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: Date;
}

class MonitoringService {
  private analytics: Analytics;
  private errorQueue: ErrorReport[] = [];
  private readonly BATCH_SIZE = 10;
  private readonly ERROR_THRESHOLD = 5;
  private errorCount: Record<string, number> = {};

  constructor() {
    this.analytics = getAnalytics();
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, { type: 'unhandledRejection' }, 'high');
    });

    window.addEventListener('error', (event) => {
      this.logError(event.error, { type: 'uncaughtError' }, 'high');
    });
  }

  public logError(
    error: Error | FirebaseError,
    context?: Record<string, any>,
    severity: ErrorReport['severity'] = 'medium',
    userId?: string
  ) {
    const errorReport: ErrorReport = {
      error,
      context,
      userId,
      severity,
      timestamp: new Date(),
    };

    this.errorQueue.push(errorReport);
    this.updateErrorCount(error);

    // Log to Firebase Analytics
    logEvent(this.analytics, 'error', {
      error_name: error.name,
      error_message: error.message,
      error_severity: severity,
      ...context,
    });

    // Check if we need to send alerts
    this.checkErrorThresholds(error);

    // Process queue if we've reached batch size
    if (this.errorQueue.length >= this.BATCH_SIZE) {
      this.processErrorQueue();
    }
  }

  private updateErrorCount(error: Error | FirebaseError) {
    const errorKey = `${error.name}:${error.message}`;
    this.errorCount[errorKey] = (this.errorCount[errorKey] || 0) + 1;
  }

  private checkErrorThresholds(error: Error | FirebaseError) {
    const errorKey = `${error.name}:${error.message}`;
    if (this.errorCount[errorKey] >= this.ERROR_THRESHOLD) {
      this.sendAlert({
        type: 'error_threshold',
        message: `Error threshold reached for: ${errorKey}`,
        count: this.errorCount[errorKey],
        severity: 'high',
      });
      // Reset count after alert
      this.errorCount[errorKey] = 0;
    }
  }

  private async processErrorQueue() {
    if (this.errorQueue.length === 0) return;

    try {
      // Here you would typically send to your error tracking service
      // For example, Sentry or your own error tracking endpoint
      console.error('Processing error batch:', this.errorQueue);
      
      // Clear the queue after successful processing
      this.errorQueue = [];
    } catch (error) {
      console.error('Failed to process error queue:', error);
    }
  }

  public logPerformanceMetric(metric: Omit<PerformanceMetric, 'timestamp'>) {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date(),
    };

    // Log to Firebase Analytics
    logEvent(this.analytics, 'performance_metric', {
      metric_name: metric.name,
      metric_value: metric.value,
      ...metric.tags,
    });

    // Check performance thresholds
    this.checkPerformanceThresholds(fullMetric);
  }

  private checkPerformanceThresholds(metric: PerformanceMetric) {
    const thresholds: Record<string, number> = {
      'page_load': 3000, // 3 seconds
      'api_response': 1000, // 1 second
      'payment_processing': 5000, // 5 seconds
    };

    if (thresholds[metric.name] && metric.value > thresholds[metric.name]) {
      this.sendAlert({
        type: 'performance_threshold',
        message: `Performance threshold exceeded for: ${metric.name}`,
        value: metric.value,
        threshold: thresholds[metric.name],
        severity: 'medium',
      });
    }
  }

  private async sendAlert(alert: {
    type: string;
    message: string;
    severity: string;
    [key: string]: any;
  }) {
    // Log alert to Firebase Analytics
    logEvent(this.analytics, 'alert', alert);

    // Here you would typically integrate with your alert service
    // For example, sending to Slack, email, or SMS
    console.warn('Alert:', alert);
  }

  // Méthodes spécifiques pour le monitoring des transactions
  public monitorTransaction(transactionId: string, amount: number) {
    logEvent(this.analytics, 'transaction_initiated', {
      transaction_id: transactionId,
      amount,
    });

    // Surveiller le temps de traitement
    const startTime = Date.now();
    return {
      complete: () => {
        const duration = Date.now() - startTime;
        this.logPerformanceMetric({
          name: 'payment_processing',
          value: duration,
          tags: { transaction_id: transactionId },
        });
      },
      fail: (error: Error) => {
        this.logError(error, { 
          transaction_id: transactionId,
          amount,
        }, 'high');
      },
    };
  }

  // Méthodes spécifiques pour le monitoring des API
  public monitorApiCall(endpoint: string) {
    const startTime = Date.now();
    return {
      complete: (status: number) => {
        const duration = Date.now() - startTime;
        this.logPerformanceMetric({
          name: 'api_response',
          value: duration,
          tags: { endpoint, status: status.toString() },
        });

        if (status >= 400) {
          this.sendAlert({
            type: 'api_error',
            message: `API error on ${endpoint}`,
            status,
            severity: status >= 500 ? 'high' : 'medium',
          });
        }
      },
    };
  }
}

export const monitoring = new MonitoringService();
