import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Calendar
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { rotationService } from '../services/rotationService';
import { getApiErrorMessage } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function RotationPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentHousehold, loading: householdLoading, error: householdError } = useHousehold();

  const [rotationData, setRotationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [rotationError, setRotationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const rotationInProgress = useRef(false);

  useEffect(() => {
    let active = true;
    if (householdLoading) {
      setLoading(true);
      return () => { active = false; };
    }
    setSuccessMessage('');
    if (!currentHousehold?.id) {
      setRotationData(null);
      setLoading(false);
      setRotationError('');
      return () => { active = false; };
    }
    setLoading(true);
    setRotationData(null);
    setRotationError('');
    rotationService.getRotation(currentHousehold.id)
      .then((data) => {
        if (active) setRotationData(data);
      })
      .catch((err) => {
        if (active) {
          setRotationError(getApiErrorMessage(err, 'Unable to load chore rotation.'));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [currentHousehold?.id, householdLoading]);

  const handleExecuteRotation = async () => {
    const householdId = currentHousehold?.id;
    if (!householdId) {
      setRotationError('Select a household before rotating chores.');
      return;
    }
    if (rotationInProgress.current) return;

    rotationInProgress.current = true;
    setRotating(true);
    setRotationError('');
    setSuccessMessage('');
    try {
      const result = await rotationService.rotateChores(householdId);
      if (currentHousehold?.id === householdId) {
        setRotationData(result);
        setSuccessMessage(result.message || 'Chores were rotated successfully.');
      }
    } catch (err) {
      setRotationError(getApiErrorMessage(err, 'Unable to rotate chores.'));
    } finally {
      rotationInProgress.current = false;
      setRotating(false);
    }
  };

  const choreRotations = rotationData?.choreRotations || [];
  const memberWorkloads = rotationData?.memberWorkloads || [];

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
            disabled={rotating || loading || householdLoading || !currentHousehold?.id}
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

        {(householdError || rotationError) && (
          <div role="alert" className="card" style={{ padding: 14, marginBottom: 18, color: 'var(--color-danger-text)' }}>
            {householdError || rotationError}
          </div>
        )}

        {householdLoading || loading ? (
          <LoadingSpinner text="Calculating rotation state..." />
        ) : !currentHousehold ? (
          <div className="card empty-state">
            <h4>No household selected</h4>
            <p>Select or join a household before viewing chore rotation.</p>
          </div>
        ) : rotationError ? (
          <div className="card empty-state">
            <h4>Rotation data is unavailable</h4>
            <p>{rotationError}</p>
          </div>
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
              {memberWorkloads.length === 0 ? (
                <div className="card empty-state">
                  <p>No household members were returned.</p>
                </div>
              ) : memberWorkloads.map((m) => (
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

              {choreRotations.length === 0 ? (
                <p style={{ color: 'var(--color-muted)' }}>There are no chores to rotate in this household.</p>
              ) : <div className="table-responsive">
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
              </div>}
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
                    Each chore moves to an eligible member with the lightest current assignment load. Stable household order breaks ties, and the current assignee is skipped when another member is available.
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
