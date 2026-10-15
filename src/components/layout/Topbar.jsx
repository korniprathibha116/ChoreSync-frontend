import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ onToggleMobileMenu, title, subtitle }) {
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const userInitial = currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A';
  const displayName = currentUser?.displayName || 'Alex';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <div className="topbar-title-wrap">
          <h1>{title || `Welcome back, ${displayName}!`}</h1>
          <p>{subtitle || "Here's what's happening in your household today."}</p>
        </div>
      </div>

      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <button
            className="notification-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                width: 280,
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '16px',
                zIndex: 50,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Notifications</div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>
                • Sam completed Clean bathroom<br />
                • Laundry is due today<br />
                • Fair rotation scheduled in 6 days
              </div>
            </div>
          )}
        </div>

        <div className="topbar-user">
          <div className="avatar avatar-md avatar-purple">
            {userInitial}
          </div>
          <span className="topbar-user-name">{displayName}</span>
        </div>
      </div>
    </header>
  );
}
