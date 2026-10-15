import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-border)',
        padding: '48px 24px 32px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 36,
          marginBottom: 40,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'var(--font-heading)',
              fontSize: 20,
              fontWeight: 800,
              color: 'var(--color-text)',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #B59BFA, #9B7AE8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Home size={18} strokeWidth={2.5} />
            </div>
            <span>ChoreSync</span>
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.6, maxWidth: 280 }}>
            A smarter, fairer way to share your household chores and split expenses with roommates.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--color-text)' }}>
            Product
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <li><a href="#features" style={{ color: 'var(--color-muted)' }}>Fair Chore Rotation</a></li>
            <li><a href="#features" style={{ color: 'var(--color-muted)' }}>Shared Expenses</a></li>
            <li><a href="#features" style={{ color: 'var(--color-muted)' }}>Task Tracking</a></li>
            <li><a href="#features" style={{ color: 'var(--color-muted)' }}>Household Insights</a></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--color-text)' }}>
            Navigation
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <li><Link to="/login" style={{ color: 'var(--color-muted)' }}>Sign In</Link></li>
            <li><Link to="/register" style={{ color: 'var(--color-muted)' }}>Create Account</Link></li>
            <li><Link to="/dashboard" style={{ color: 'var(--color-muted)' }}>Household Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--color-text)' }}>
            About ChoreSync
          </h4>
          <p style={{ color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.6 }}>
            Designed for co-living spaces, student housing, and families who believe in equal sharing and harmonic living.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          paddingTop: 24,
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 12,
          color: 'var(--color-muted)',
        }}
      >
        <span>© 2026 ChoreSync. All rights reserved.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          Crafted with <Heart size={14} color="#E8618C" fill="#E8618C" /> for happier shared spaces
        </span>
      </div>
    </footer>
  );
}
