import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
          {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
          {toast.type === 'warning' && <AlertTriangle size={18} color="#f59e0b" />}
          {toast.type === 'info' && <Info size={18} color="#3b82f6" />}
          
          <span style={{ flex: 1 }}>{toast.message}</span>
          
          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-muted)', display: 'flex' }}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
