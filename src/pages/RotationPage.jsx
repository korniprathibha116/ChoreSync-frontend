import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Info,
  Calendar
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { rotationService } from '../services/rotationService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function RotationPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentHousehold } = useHousehold();

  const [rotationData, setRotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadRotation = async () => {
    if (!currentHousehold) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await rotationService.getRotation(currentHousehold.id);
      setRotationData(data);
    } catch (err) {
      console.error('Failed to load rotation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRotation();
  }, [currentHousehold]);

  const handleExecuteRotation = async () => {
    try {
      setRotating(true);
      setSuccessMessage('');
      const result = await rotationService.rotateChores(currentHousehold.id);
      setRotationData(result);
      setSuccessMessage(result.message || 'Chores successfully rotated to next members!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert('Rotation error: ' + (err.response?.data?.message || err.message));
    } finally {
      setRotating(false);
    }
  };

  const choreRotations = rotationData?.choreRotations && rotationData.choreRotations.length > 0
    ? rotationData.choreRotations
    : [
        { id: 1, title: 'Take out trash', currentAssignee: 'Alex (You)', nextAssignee: 'Priya', difficulty: 'Medium', completed: false },
        { id: 2, title: 'Clean kitchen', currentAssignee: 'Priya', nextAssignee: 'Sam', difficulty: 'Low', completed: false },
        { id: 3, title: 'Laundry', currentAssignee: 'Sam', nextAssignee: 'Jordan', difficulty: 'High', completed: false },
        { id: 4, title: 'Vacuum living room', currentAssignee: 'Jordan', nextAssignee: 'Alex (You)', difficulty: 'Medium', completed: false },
        { id: 5, title: 'Clean bathroom', currentAssignee: 'Alex (You)', nextAssignee: 'Priya', difficulty: 'Low', completed: true },
      ];

  const memberWorkloads = rotationData?.memberWorkloads && rotationData.memberWorkloads.length > 0
    ? rotationData.memberWorkloads
    : [
        { userId: 1, name: 'Alex (You)', assignedChores: 2, completedChores: 3, workloadScore: 3.5 },
        { userId: 2, name: 'Priya', assignedChores: 1, completedChores: 4, workloadScore: 3.0 },
        { userId: 3, name: 'Sam', assignedChores: 1, completedChores: 2, workloadScore: 2.0 },
        { userId: 4, name: 'Jordan', assignedChores: 1, completedChores: 2, workloadScore: 2.0 },
      ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'This Week';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title="Fair Chore Rotation"
        subtitle="Automated, equitable distribution across all household members."
      />

      <div className="page-container">
        {/* Top Header Row with Trigger Button */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-lavender)',
                color: 'var(--color-primary-dark)',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              <Calendar size={14} /> Interval: Weekly (Every 7 Days)
            </span>
          </div>

          <button
            className="btn btn-primary btn-pill"
            onClick={handleExecuteRotation}
            disabled={rotating}
          >
            <RotateCcw size={16} className={rotating ? 'animate-spin' : ''} />
            <span>{rotating ? 'Balancing Workloads...' : 'Rotate Chores Fairly'}</span>
          </button>
        </div>

        {successMessage && (
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
            <span>{successMessage}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Calculating rotation state..." />
        ) : (
          <>
            {/* WORKLOAD DISTRIBUTION CARDS */}
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              Current Workload Balance
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 28,
              }}
            >
              {memberWorkloads.map((m) => (
                <div key={m.userId} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <strong style={{ fontSize: 15, color: 'var(--color-text)' }}>{m.name}</strong>
                    <span className="badge badge-medium">Active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-muted)', marginBottom: 6 }}>
                    <span>Active tasks:</span>
                    <strong style={{ color: 'var(--color-text)' }}>{m.assignedChores}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-muted)' }}>
                    <span>Completed:</span>
                    <strong style={{ color: 'var(--color-mint-text)' }}>{m.completedChores}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* ROTATION PIPELINE TABLE */}
            <div className="card" style={{ padding: '24px', marginBottom: 28 }}>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Next In Line Assignment</h3>
                <p style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                  Preview where chores shift upon the next rotation cycle.
                </p>
              </div>

              <div className="table-responsive">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Chore Title</th>
                      <th>Current Assignee</th>
                      <th></th>
                      <th>Next Assignee</th>
                      <th>Priority</th>
                      <th>Cycle Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {choreRotations.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong style={{ fontSize: 14 }}>{c.title}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                            {c.currentAssignee}
                          </span>
                        </td>
                        <td style={{ width: 40, textAlign: 'center' }}>
                          <ArrowRight size={16} color="var(--color-primary)" />
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: 'var(--color-primary-dark)',
                              backgroundColor: 'var(--color-lavender)',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                            }}
                          >
                            {c.nextAssignee}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${(c.difficulty || 'medium').toLowerCase()}`}>
                            {c.difficulty || 'Medium'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${c.completed ? 'completed' : 'pending'}`}>
                            {c.completed ? 'Done This Cycle' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROTATION ALGORITHM EXPLANATION CARD */}
            <div
              className="card"
              style={{
                padding: '24px',
                backgroundColor: 'var(--color-lavender)',
                border: '1px solid rgba(155, 122, 232, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                    Deterministic Fair Rotation Logic
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    ChoreSync uses a deterministic workload-balanced round-robin algorithm. Instead of random assignments, the engine factors in historical completions and task weights to ensure chores circulate evenly among all household members without repeated clustering.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
