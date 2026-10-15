import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { reportService } from '../services/reportService';
import { getApiErrorMessage } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ReportsPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentHousehold, loading: householdLoading, error: householdError } = useHousehold();

  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadReports() {
      if (householdLoading) {
        setLoading(true);
        return;
      }
      if (!currentHousehold?.id) {
        setReportData(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setReportError('');
        const data = await reportService.getReports(currentHousehold.id, timeRange);
        if (active) setReportData(data);
      } catch (err) {
        if (active) {
          setReportData(null);
          setReportError(getApiErrorMessage(err, 'Unable to load household reports.'));
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadReports();
    return () => { active = false; };
  }, [currentHousehold?.id, householdLoading, timeRange]);

  const choresByMember = reportData?.choresByMember || [];

  const barColors = ['#9B7AE8', '#4ECDC4', '#FFD166', '#FF9F9B', '#A8DADC'];

  const expenseBreakdown = reportData?.expenseBreakdown || [];

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title="Reports"
        subtitle="View household insights and statistics."
      />

      <div className="page-container">
        {/* Date range row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="var(--color-muted)" />
            <select
              className="form-input"
              style={{ width: 'auto', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
        </div>

        {householdError && (
          <div role="alert" className="card" style={{ padding: 14, marginBottom: 18, color: 'var(--color-danger-text)' }}>
            {householdError}
          </div>
        )}
        {householdLoading || loading ? (
          <LoadingSpinner text="Generating reports..." />
        ) : !currentHousehold ? (
          <div className="card empty-state">
            <h4>No household selected</h4>
            <p>Join or create a household to view its reports.</p>
          </div>
        ) : reportError ? (
          <div role="alert" className="card empty-state">
            <h4>Could not load reports</h4>
            <p>{reportError}</p>
          </div>
        ) : (
          <>
            {/* TWO CHARTS ROW (MATCHING REFERENCE IMAGE) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
                marginBottom: 28,
              }}
            >
              {/* Chores by Member Bar Chart */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Chores by Member</h3>
                <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block', marginBottom: 20 }}>
                  Completed chore distribution across roommates
                </span>

                <div style={{ width: '100%', height: 260 }}>
                  {choresByMember.length === 0 ? <p style={{ color: 'var(--color-muted)' }}>No chore activity for this period.</p> : <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={choresByMember} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#8C8799" fontSize={12} tickLine={false} />
                      <YAxis stroke="#8C8799" fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          border: '1px solid #EAE7F0',
                          fontSize: 12,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        }}
                      />
                      <Bar dataKey="completed" radius={[8, 8, 0, 0]}>
                        {choresByMember.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>}
                </div>
              </div>

              {/* Expense Breakdown Donut/Pie Chart */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Expense Breakdown</h3>
                <span style={{ fontSize: 12, color: 'var(--color-muted)', display: 'block', marginBottom: 20 }}>
                  Spending categorized across household needs
                </span>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div style={{ width: '100%', height: 240 }}>
                    {expenseBreakdown.length === 0 ? <p style={{ color: 'var(--color-muted)' }}>No household expenses for this period.</p> : <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                        >
                          {expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-pie-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '10px',
                            border: '1px solid #EAE7F0',
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {expenseBreakdown.map((item) => (
                      <div
                        key={item.name}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: item.color,
                            }}
                          />
                          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                            {item.name}
                          </span>
                        </div>
                        <strong style={{ color: 'var(--color-text)' }}>
                          {item.percentage}%
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Workload Distribution Table / Progress Row */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                Household Workload Distribution
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {choresByMember.map((m, idx) => {
                  const pct = Math.min(Math.round((m.completed / 10) * 100), 100);
                  return (
                    <div
                      key={m.name}
                      style={{
                        padding: '16px',
                        backgroundColor: '#FAF9FE',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <strong style={{ fontSize: 14 }}>{m.name}</strong>
                        <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 700 }}>
                          {m.completed} chores
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: '#EAE7F0',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${pct}%`,
                            backgroundColor: barColors[idx % barColors.length],
                            borderRadius: 'var(--radius-full)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
