import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function PublicNavbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        height: 80,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--color-text)',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #B59BFA, #9B7AE8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 10px rgba(155, 122, 232, 0.35)',
            }}
          >
            <Home size={22} strokeWidth={2.5} />
          </div>
          <span>ChoreSync</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
          className="desktop-nav"
        >
          <a href="#features" style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 14 }}>
            Features
          </a>
          <a href="#how-it-works" style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 14 }}>
            How It Works
          </a>
          <a href="#about" style={{ color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: 14 }}>
            About
          </a>
        </nav>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-actions">
          {currentUser ? (
            <Link to="/dashboard" className="btn btn-primary btn-pill">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline btn-pill"
                style={{ padding: '8px 20px', fontSize: 14 }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-pill"
                style={{ padding: '8px 22px', fontSize: 14 }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', color: 'var(--color-text)' }}
          className="mobile-nav-btn"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text)', fontWeight: 500 }}>
            Features
          </a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text)', fontWeight: 500 }}>
            How It Works
          </a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--color-text)', fontWeight: 500 }}>
            About
          </a>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Link to="/login" className="btn btn-outline btn-pill" style={{ flex: 1 }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-pill" style={{ flex: 1 }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
