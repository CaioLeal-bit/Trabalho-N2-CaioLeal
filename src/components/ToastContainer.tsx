import { useEstudosStore } from '../store/useEstudosStore';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect } from 'react';

export default function ToastContainer() {
  const { toasts, removeToast } = useEstudosStore();

  useEffect(() => {
    // Auto-remover toasts após 5 segundos
    toasts.forEach(t => {
      const timer = setTimeout(() => {
        removeToast(t.id);
      }, 5000);
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="position-fixed p-3 d-flex flex-column gap-2" style={{ top: 0, right: 0, zIndex: 9999, maxWidth: '400px' }}>
      {toasts.map(toast => {
        let bgColor = '#212529';
        let borderColor = '#6c757d';
        let Icon = Info;
        let iconColor = 'text-info';

        if (toast.type === 'success') {
          bgColor = '#198754';
          borderColor = '#146c43';
          Icon = CheckCircle;
          iconColor = 'text-white';
        } else if (toast.type === 'error') {
          bgColor = '#dc3545';
          borderColor = '#b02a37';
          Icon = AlertTriangle;
          iconColor = 'text-white';
        }

        return (
          <div key={toast.id} className="toast show align-items-center text-white shadow-lg opacity-100" style={{ backgroundColor: bgColor, borderColor: borderColor, opacity: 1, borderWidth: '1px', borderStyle: 'solid' }} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2 fw-bold">
                <Icon size={20} className={iconColor} />
                {toast.message}
              </div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => removeToast(toast.id)} aria-label="Close"></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
