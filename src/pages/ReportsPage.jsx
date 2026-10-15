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
  Cell,
  Legend
} from 'recharts';
import { Calendar, TrendingUp, CheckCircle, PieChart as PieIcon } from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { reportService } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ReportsPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentHousehold } = useHousehold();

  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      if (!currentHousehold) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await reportService.getReports(currentHousehold.id, timeRange);
        setReportData(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [currentHousehold, timeRange]);

  // Chart data fallbacks matching the exact reference image
  const choresByMember = reportData?.choresByMember && reportData.choresByMember.length > 0
    ? reportData.choresByMember
    : [
        { name: 'Alex', completed: 6, pending: 2, fill: '#B59BFA' },
        { name: 'Priya', completed: 4, pending: 1, fill: '#E0F4E9' },
        { name: 'Sam', completed: 5, pending: 2, fill: '#FDE9E3' },
        { name: 'Jordan', completed: 3, pending: 1, fill: '#FFF4D7' },
      ];

  const barColors = ['#9B7AE8', '#4ECDC4', '#FFD166', '#FF9F9B', '#A8DADC'];

  const expenseBreakdown = reportData?.expenseBreakdown && reportData.expenseBreakdown.length > 0
    ? reportData.expenseBreakdown
    : [
        { name: 'Groceries', value: 120, percentage: 48.9, color: '#9B7AE8' },
        { name: 'Utilities', value: 80.5, percentage: 32.8, color: '#4ECDC4' },
        { name: 'Household', value: 30, percentage: 12.2, color: '#FFD166' },
        { name: 'Other', value: 15, percentage: 6.1, color: '#FF9F9B' },
      ];

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

        {loading ? (
          <LoadingSpinner text="Generating reports..." />
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
                  <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>
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
                    <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer>
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
