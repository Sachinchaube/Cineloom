// Centralized Logging Service
import { storageService } from './storageService';

export const LogSeverity = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  AUDIT: 'AUDIT'
};

export const loggerService = {
  log(action, details = {}, severity = LogSeverity.INFO) {
    const logs = storageService.get(storageService.KEYS.LOGS) || [];
    const entry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      severity
    };
    
    // Keep most recent 200 logs
    const updated = [entry, ...logs].slice(0, 200);
    storageService.set(storageService.KEYS.LOGS, updated);
    
    if (severity === LogSeverity.ERROR) {
      console.error(`[CINELOOM ${severity}] ${action}`, details);
    } else {
      console.log(`[CINELOOM ${severity}] ${action}`, details);
    }

    return entry;
  },

  info(action, details) {
    return this.log(action, details, LogSeverity.INFO);
  },

  warn(action, details) {
    return this.log(action, details, LogSeverity.WARN);
  },

  error(action, details) {
    return this.log(action, details, LogSeverity.ERROR);
  },

  audit(action, details) {
    return this.log(action, details, LogSeverity.AUDIT);
  },

  getLogs(severityFilter = null) {
    const logs = storageService.get(storageService.KEYS.LOGS) || [];
    if (!severityFilter) return logs;
    return logs.filter(l => l.severity === severityFilter);
  },

  clearLogs() {
    storageService.set(storageService.KEYS.LOGS, []);
  }
};
