import { useEffect } from 'react';

function Toast({ mensaje, tipo, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div className={`toast ${tipo} ${visible ? 'show' : ''}`}>
      {mensaje}
    </div>
  );
}

export default Toast;