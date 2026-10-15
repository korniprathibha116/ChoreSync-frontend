import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  User,
  Bell,
  Home,
  Save,
  LogOut,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../hooks/useAuth';
import { useHousehold } from '../hooks/useHousehold';
import { userService } from '../services/userService';

export default function SettingsPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentUser, logout, setCurrentUser } = useAuth();
  const { currentHousehold } = useHousehold();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  const [notifyChores, setNotifyChores] = useState(true);
  const [notifyExpenses, setNotifyExpenses] = useState(true);
  const [notifyRotations, setNotifyRotations] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      setSaving(true);
      const updated = await userService.updateProfile({
        firstName,
        lastName,
        displayName,
      });
      setCurrentUser(updated);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title="Settings"
        subtitle="Manage your profile, household preferences, and notifications."
      />

      <div className="page-container" style={{ maxWidth: 800 }}>
        {success && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--color-mint)',
              color: 'var(--color-mint-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Profile Details */}
        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--color-lavender)',
                color: 'var(--color-primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Profile Details</h3>
              <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Your personal details and display name within the household
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                disabled
                style={{ backgroundColor: '#F8F7FC', color: 'var(--color-muted)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4, display: 'block' }}>
                Email cannot be modified directly in dev environment.
              </span>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>

        {/* 2. Notification Preferences */}
        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'var(--color-mint)',
                color: 'var(--color-mint-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notification Preferences</h3>
              <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                Configure when and how you receive chore and expense alerts
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <strong style={{ display: 'block', fontSize: 14 }}>Chore Assignments & Reminders</strong>
                <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Get notified when tasks are assigned or due today</span>
              </div>
              <input
                type="checkbox"
                checked={notifyChores}
                onChange={(e) => setNotifyChores(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <strong style={{ display: 'block', fontSize: 14 }}>Expense Updates</strong>
                <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Get notified when roommates log shared bills or settlements</span>
              </div>
              <input
                type="checkbox"
                checked={notifyExpenses}
                onChange={(e) => setNotifyExpenses(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <strong style={{ display: 'block', fontSize: 14 }}>Weekly Rotation Notifications</strong>
                <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Receive an overview when the chore cycle rotates</span>
              </div>
              <input
                type="checkbox"
                checked={notifyRotations}
                onChange={(e) => setNotifyRotations(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
              />
            </label>
          </div>
        </div>

        {/* 3. Account Actions */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#C53030' }}>
            Account Actions
          </h3>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>
            Sign out of your active session on this device.
          </p>
          <button
            onClick={handleLogout}
            className="btn btn-outline"
            style={{ color: '#C53030', borderColor: '#FCA5A5' }}
          >
            <LogOut size={16} />
            <span>Log Out of ChoreSync</span>
          </button>
        </div>
      </div>
    </>
  );
}
