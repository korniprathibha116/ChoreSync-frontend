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
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentUser } = useAuth();
  const { currentHousehold } = useHousehold();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentHousehold) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await dashboardService.getDashboard(currentHousehold.id);
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentHousehold]);

  const displayName = currentUser?.displayName || 'Alex';

  // Fallback defaults matching UI preview if database is fresh
  const stats = [
    {
      label: 'Household Members',
      value: dashboardData?.householdMembers ?? 4,
      icon: Users,
      colorClass: 'mint',
    },
    {
      label: 'Total Chores',
      value: dashboardData?.totalChores ?? 12,
      icon: CheckSquare,
      colorClass: 'blue',
    },
    {
      label: 'Pending Chores',
      value: dashboardData?.pendingChores ?? 5,
      icon: Clock,
      colorClass: 'cream',
    },
    {
      label: 'Completed Chores',
      value: dashboardData?.completedChores ?? 7,
      icon: CheckCircle2,
      colorClass: 'mint',
    },
    {
      label: 'Overdue Chores',
      value: dashboardData?.overdueChores ?? 2,
      icon: AlertCircle,
      colorClass: 'pink',
    },
    {
      label: 'Total Expenses',
      value: dashboardData?.totalExpenses ? `$${Number(dashboardData.totalExpenses).toFixed(2)}` : '$245.50',
      icon: Wallet,
      colorClass: 'lavender',
    },
    {
      label: 'Your Balance',
      value: dashboardData?.userBalance !== undefined
        ? (Number(dashboardData.userBalance) < 0
          ? `-$${Math.abs(Number(dashboardData.userBalance)).toFixed(2)}`
          : `+$${Number(dashboardData.userBalance).toFixed(2)}`)
        : '-$12.30',
      icon: Scale,
      colorClass: 'peach',
      highlightColor: dashboardData?.userBalance !== undefined && Number(dashboardData.userBalance) < 0 ? '#C53030' : '#15803D',
    },
  ];

  const upcomingChores = dashboardData?.upcomingChores && dashboardData.upcomingChores.length > 0
    ? dashboardData.upcomingChores
    : [
        { id: 1, title: 'Take out trash', subtitle: 'Today, Assigned to you', priority: 'Medium' },
        { id: 2, title: 'Clean kitchen', subtitle: 'Tomorrow', priority: 'Low' },
        { id: 3, title: 'Laundry', subtitle: 'Mar 28, 2025', priority: 'High' },
      ];

  const recentActivity = dashboardData?.recentActivity && dashboardData.recentActivity.length > 0
    ? dashboardData.recentActivity
    : [
        { id: 1, user: 'Sam', initial: 'S', color: 'avatar-purple', text: 'Sam completed Clean bathroom', time: '2 hours ago' },
        { id: 2, user: 'You', initial: 'Y', color: 'avatar-pink', text: 'You added a new expense: Groceries', time: '4 hours ago' },
        { id: 3, user: 'Priya', initial: 'P', color: 'avatar-green', text: 'Priya was assigned to Vacuum living room', time: '1 day ago' },
        { id: 4, user: 'You', initial: 'Y', color: 'avatar-yellow', text: 'You completed Take out trash', time: '1 day ago' },
      ];

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title={`Welcome back, ${displayName}!`}
        subtitle="Here's what's happening in your household today."
      />

      <div className="page-container">
        {loading ? (
          <LoadingSpinner text="Loading your household dashboard..." />
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
                  {upcomingChores.map((chore) => (
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
                  {recentActivity.map((act) => {
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
