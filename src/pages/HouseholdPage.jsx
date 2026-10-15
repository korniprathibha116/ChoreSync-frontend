import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  UserPlus,
  Copy,
  Check,
  Trash2,
  Share2,
  Home
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { useAuth } from '../hooks/useAuth';
import { householdService } from '../services/householdService';
import { getApiErrorMessage } from '../services/api';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function HouseholdPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const {
    households,
    currentHousehold,
    setCurrentHousehold,
    householdSummary,
    loading: householdsLoading,
    summaryLoading,
    error: householdError,
    refreshHouseholds,
  } = useHousehold();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('Members');
  const [copied, setCopied] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [householdName, setHouseholdName] = useState('');
  const [householdDescription, setHouseholdDescription] = useState('');
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const inviteCode = currentHousehold?.inviteCode?.trim() || null;

  const handleCopyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinHousehold = async (e) => {
    e.preventDefault();
    setJoinError('');
    if (!joinCode.trim()) {
      setJoinError('Please enter an invite code.');
      return;
    }
    try {
      setJoinLoading(true);
      const joinedHousehold = await householdService.joinHousehold(joinCode.trim());
      setIsJoinModalOpen(false);
      setJoinCode('');
      await refreshHouseholds(joinedHousehold.id);
    } catch (err) {
      setJoinError(getApiErrorMessage(err, 'Unable to join this household.'));
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreateHousehold = async (e) => {
    e.preventDefault();
    setCreateError('');
    if (!householdName.trim()) {
      setCreateError('Household name is required.');
      return;
    }
    try {
      setCreateLoading(true);
      const createdHousehold = await householdService.createHousehold({
        name: householdName.trim(),
        description: householdDescription.trim(),
      });
      setIsCreateModalOpen(false);
      setHouseholdName('');
      setHouseholdDescription('');
      await refreshHouseholds(createdHousehold.id);
    } catch (err) {
      setCreateError(getApiErrorMessage(err, 'Unable to create household.'));
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId, targetName) => {
    if (window.confirm(`Are you sure you want to remove ${targetName} from the household?`)) {
      try {
        await householdService.removeMember(currentHousehold.id, targetUserId);
        await refreshHouseholds();
      } catch (err) {
        alert(`Failed to remove member: ${getApiErrorMessage(err, 'Please try again.')}`);
      }
    }
  };

  const members = householdSummary?.members || [];

  const avatarColors = ['avatar-purple', 'avatar-yellow', 'avatar-pink', 'avatar-green', 'avatar-blue'];

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title="Household"
        subtitle="Manage your household and members."
      />

      <div className="page-container">
        {/* Controls row */}
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
          {/* Tabs: Members, Invite Code */}
          <div className="filter-tabs">
            <button
              className={`filter-tab-btn ${activeTab === 'Members' ? 'active' : ''}`}
              onClick={() => setActiveTab('Members')}
            >
              Members
            </button>
            <button
              className={`filter-tab-btn ${activeTab === 'Invite Code' ? 'active' : ''}`}
              onClick={() => setActiveTab('Invite Code')}
            >
              Invite Code
            </button>
          </div>

          {households.length > 1 && (
            <label className="form-group" style={{ margin: 0 }}>
              <span className="form-label">Selected household</span>
              <select
                className="form-input"
                value={currentHousehold?.id || ''}
                onChange={(event) => {
                  const selected = households.find((household) => String(household.id) === event.target.value);
                  setCurrentHousehold(selected).catch(() => {});
                }}
              >
                {households.map((household) => (
                  <option key={household.id} value={household.id}>{household.name}</option>
                ))}
              </select>
            </label>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-outline btn-pill"
              onClick={() => {
                setCreateError('');
                setIsCreateModalOpen(true);
              }}
            >
              <Home size={15} />
              <span>Create Household</span>
            </button>
            <button
              className="btn btn-outline btn-pill"
              onClick={() => setIsJoinModalOpen(true)}
            >
              <Home size={15} />
              <span>Join Another Space</span>
            </button>
            <button
              className="btn btn-primary btn-pill"
              onClick={() => setIsInviteModalOpen(true)}
              disabled={!inviteCode}
            >
              <UserPlus size={16} />
              <span>+ Invite Member</span>
            </button>
          </div>
        </div>

        {householdError && (
          <div role="alert" className="card" style={{ padding: 14, marginBottom: 18, color: 'var(--color-danger-text)' }}>
            {householdError}
          </div>
        )}

        {activeTab === 'Members' ? (
          /* MEMBERS LIST TABLE / CARD */
          <div className="card" style={{ padding: '8px 24px' }}>
            <div
              style={{
                padding: '16px 0',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: 16, color: 'var(--color-text)' }}>
                  {currentHousehold?.name || 'Household'} Members
                </strong>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                  {members.length} {members.length === 1 ? 'member' : 'members'} in this household
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {householdsLoading || summaryLoading ? (
                <LoadingSpinner text="Loading household members..." />
              ) : !currentHousehold ? (
                <p style={{ padding: '20px 0', color: 'var(--color-muted)' }}>
                  You do not belong to a household yet. Join one with an invite code.
                </p>
              ) : members.length === 0 ? (
                <p style={{ padding: '20px 0', color: 'var(--color-muted)' }}>
                  No household members were returned.
                </p>
              ) : members.map((member, idx) => {
                const isMe = member.userId === currentUser?.id;
                const isOwner = member.role?.toUpperCase() === 'OWNER';
                const initial = member.displayName ? member.displayName.charAt(0).toUpperCase() : 'U';
                const colorClass = avatarColors[idx % avatarColors.length];

                return (
                  <div
                    key={member.userId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 0',
                      borderBottom: idx < members.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className={`avatar avatar-md ${colorClass}`}>
                        {initial}
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: 'var(--color-text)' }}>
                          {member.displayName} {isMe && '(You)'}
                        </strong>
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                          {member.email}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span className={`badge ${isOwner ? 'badge-owner' : 'badge-member'}`}>
                        {isOwner ? 'Owner' : 'Member'}
                      </span>

                      {!isMe && (
                        <button
                          className="btn btn-icon-only btn-outline"
                          onClick={() => handleRemoveMember(member.userId, member.displayName)}
                          title="Remove from household"
                          style={{ color: '#E8618C' }}
                          aria-label={`Remove ${member.displayName}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* INVITE CODE VIEW */
          <div className="card" style={{ maxWidth: 540, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'var(--color-lavender)',
                  color: 'var(--color-primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Share2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Household Invite Code</h3>
                <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                  Share this code with roommates to give them access to this household.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-lavender)',
                border: '1.5px dashed var(--color-primary)',
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: 3,
                  color: 'var(--color-primary-dark)',
                }}
              >
                {inviteCode || 'No household invite code is currently available.'}
              </span>

              <button className="btn btn-primary btn-sm btn-pill" onClick={handleCopyCode} disabled={!inviteCode}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Share the invite code with people who should join this household.
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a Household"
      >
        {createError && (
          <div role="alert" style={{
            padding: '10px 14px',
            backgroundColor: 'var(--color-danger-bg)',
            color: 'var(--color-danger-text)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            marginBottom: 16,
          }}>
            {createError}
          </div>
        )}
        <form onSubmit={handleCreateHousehold}>
          <div className="form-group">
            <label className="form-label" htmlFor="household-name">Household name</label>
            <input
              id="household-name"
              type="text"
              className="form-input"
              value={householdName}
              onChange={(event) => setHouseholdName(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="household-description">Description (optional)</label>
            <textarea
              id="household-description"
              className="form-input"
              value={householdDescription}
              onChange={(event) => setHouseholdDescription(event.target.value)}
              rows={3}
            />
          </div>
          <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Household'}
            </button>
          </div>
        </form>
      </Modal>

      {/* INVITE MODAL */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Roommates"
      >
        <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--color-lavender)',
              color: 'var(--color-primary-dark)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <UserPlus size={26} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            Share Your Household Code
          </h4>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20 }}>
            Send this invite code to your roommates to join <strong>{currentHousehold?.name || 'your household'}</strong>.
          </p>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#FAF9FE',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
              {inviteCode || 'No household invite code is currently available.'}
            </span>
            <button className="btn btn-primary btn-sm btn-pill" onClick={handleCopyCode} disabled={!inviteCode}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => setIsInviteModalOpen(false)}
          >
            Done
          </button>
        </div>
      </Modal>

      {/* JOIN SPACE MODAL */}
      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join a Household"
      >
        {joinError && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {joinError}
          </div>
        )}

        <form onSubmit={handleJoinHousehold}>
          <div className="form-group">
            <label className="form-label">Household Invite Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter the code shared by a household member"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsJoinModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={joinLoading}>
              {joinLoading ? 'Joining...' : 'Join Space'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
