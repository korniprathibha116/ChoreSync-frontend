import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  RefreshCw,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  Home,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useHousehold } from '../../hooks/useHousehold';

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const { currentHousehold, householdSummary } = useHousehold();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/household', label: 'Household', icon: Users },
    { to: '/chores', label: 'Chores', icon: CheckSquare },
    { to: '/rotation', label: 'Fair Rotation', icon: RefreshCw },
    { to: '/expenses', label: 'Expenses', icon: Wallet },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userInitial = currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-logo" onClick={onClose}>
            <div className="logo-icon">
              <Home size={22} strokeWidth={2.5} />
            </div>
            <span>ChoreSync</span>
          </NavLink>

          <div className="household-selector-card" onClick={() => navigate('/household')}>
            <div className="household-info">
              <div className="house-icon-box">
                <Home size={18} />
              </div>
              <div className="household-name-wrap">
                <strong>{currentHousehold?.name || 'No household selected'}</strong>
                <span>{currentHousehold ? 'Shared household' : 'Join a household to get started'}</span>
              </div>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="avatar avatar-md avatar-purple">
              {userInitial}
            </div>
            <div className="sidebar-profile-text">
              <strong>{currentUser?.displayName || 'Account'}</strong>
              <span>
                {householdSummary?.members?.find((member) => member.userId === currentUser?.id)?.role || 'Household member'}
              </span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Log Out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
