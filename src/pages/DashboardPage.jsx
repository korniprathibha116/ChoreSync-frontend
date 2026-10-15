import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Users,
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Scale,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../hooks/useAuth';
import { useHousehold } from '../hooks/useHousehold';
import { dashboardService } from '../services/dashboardService';
import { getApiErrorMessage } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentUser } = useAuth();
  const { currentHousehold, loading: householdLoading, error: householdError } = useHousehold();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadData() {
      if (householdLoading) {
        setLoading(true);
        return;
      }
      if (!currentHousehold?.id) {
        setDashboardData(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setDashboardError('');
        const data = await dashboardService.getDashboard(currentHousehold.id);
        if (active) setDashboardData(data);
      } catch (err) {
        if (active) {
          setDashboardData(null);
          setDashboardError(getApiErrorMessage(err, 'Unable to load the household dashboard.'));
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, [currentHousehold?.id, householdLoading]);

  const displayName = currentUser?.displayName || 'there';

  const stats = [
    {
      label: 'Household Members',
      value: dashboardData?.householdMembers ?? 0,
      icon: Users,
      colorClass: 'mint',
    },
    {
      label: 'Total Chores',
      value: dashboardData?.totalChores ?? 0,
      icon: CheckSquare,
      colorClass: 'blue',
    },
    {
      label: 'Pending Chores',
      value: dashboardData?.pendingChores ?? 0,
      icon: Clock,
      colorClass: 'cream',
    },
    {
      label: 'Completed Chores',
      value: dashboardData?.completedChores ?? 0,
      icon: CheckCircle2,
      colorClass: 'mint',
    },
    {
      label: 'Overdue Chores',
      value: dashboardData?.overdueChores ?? 0,
      icon: AlertCircle,
      colorClass: 'pink',
    },
    {
      label: 'Total Expenses',
      value: `$${Number(dashboardData?.totalExpenses || 0).toFixed(2)}`,
      icon: Wallet,
      colorClass: 'lavender',
    },
    {
      label: 'Your Balance',
      value: Number(dashboardData?.userBalance || 0) < 0
        ? `-$${Math.abs(Number(dashboardData?.userBalance || 0)).toFixed(2)}`
        : `+$${Number(dashboardData?.userBalance || 0).toFixed(2)}`,
      icon: Scale,
      colorClass: 'peach',
      highlightColor: Number(dashboardData?.userBalance || 0) < 0 ? '#C53030' : '#15803D',
    },
  ];

  const upcomingChores = dashboardData?.upcomingChores || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title={`Welcome back, ${displayName}!`}
        subtitle="Here's what's happening in your household today."
      />

      <div className="page-container">
        {householdError && (
          <div role="alert" className="card" style={{ padding: 14, marginBottom: 18, color: 'var(--color-danger-text)' }}>
            {householdError}
          </div>
        )}
        {householdLoading || loading ? (
          <LoadingSpinner text="Loading your household dashboard..." />
        ) : !currentHousehold ? (
          <div className="card empty-state">
            <h4>No household selected</h4>
            <p>Join or create a household to see its dashboard.</p>
          </div>
        ) : dashboardError ? (
          <div role="alert" className="card empty-state">
            <h4>Could not load dashboard data</h4>
            <p>{dashboardError}</p>
          </div>
        ) : (
          <>
            {/* 7 STATS CARDS GRID */}
            <div className="stat-card-grid">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">{s.label}</span>
                      <div className={`stat-icon ${s.colorClass}`}>
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                    </div>
                    <div
                      className="stat-value"
                      style={{ color: s.highlightColor || 'var(--color-text)' }}
                    >
                      {s.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TWO COLUMNS: UPCOMING CHORES & RECENT ACTIVITY */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {/* Upcoming Chores Card */}
              <div className="card">
                <div
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Your Upcoming Chores</h3>
                  <Link
                    to="/chores"
                    style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}
                  >
                    View all
                  </Link>
                </div>

                <div style={{ padding: '12px 24px' }}>
                  {upcomingChores.length === 0 ? (
                    <p style={{ color: 'var(--color-muted)' }}>No upcoming chores.</p>
                  ) : upcomingChores.map((chore) => (
                    <div
                      key={chore.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-peach)',
                            color: 'var(--color-peach-text)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                          }}
                        >
                          <CheckSquare size={18} />
                        </div>
                        <div>
                          <strong style={{ display: 'block', fontSize: 14, color: 'var(--color-text)' }}>
                            {chore.title}
                          </strong>
                          <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                            {chore.subtitle || (chore.isAssignedToMe ? 'Assigned to you' : chore.assignedTo)}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`badge badge-${(chore.priority || 'medium').toLowerCase()}`}
                      >
                        {chore.priority || 'Medium'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="card">
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
                </div>

                <div style={{ padding: '12px 24px' }}>
                  {recentActivity.length === 0 ? (
                    <p style={{ color: 'var(--color-muted)' }}>No recent household activity.</p>
                  ) : recentActivity.map((act) => {
                    const initial = act.initial || (act.user ? act.user.charAt(0).toUpperCase() : 'U');
                    const colorClass = act.color || 'avatar-purple';
                    return (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '14px 0',
                          borderBottom: '1px solid var(--color-border-subtle)',
                        }}
                      >
                        <div className={`avatar avatar-md ${colorClass}`}>
                          {initial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ display: 'block', fontSize: 13, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {act.text}
                          </strong>
                          <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                            {act.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fair Rotation Banner */}
            <div
              style={{
                marginTop: 24,
                padding: '18px 24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-lavender)',
                border: '1px solid rgba(155, 122, 232, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: 14, color: 'var(--color-text)' }}>
                    Fair Chore Rotation Active
                  </strong>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>
                    Deterministic algorithm balances household workloads equally every week.
                  </p>
                </div>
              </div>

              <Link to="/rotation" className="btn btn-primary btn-sm btn-pill">
                View Rotation Schedule <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
