import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', gap: 12 }}>
      <Loader2 size={32} className="animate-spin" color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
