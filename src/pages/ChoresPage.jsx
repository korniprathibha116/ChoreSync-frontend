import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { useAuth } from '../hooks/useAuth';
import { choreService } from '../services/choreService';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ChoresPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentHousehold, householdSummary } = useHousehold();
  const { currentUser } = useAuth();

  const [chores, setChores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChore, setEditingChore] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAssignedToId, setFormAssignedToId] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('Medium');
  const [formDueDate, setFormDueDate] = useState('');
  const [formPoints, setFormPoints] = useState(10);
  const [formError, setFormError] = useState('');

  const loadChores = async () => {
    if (!currentHousehold) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await choreService.getChores(currentHousehold.id);
      setChores(data);
    } catch (err) {
      console.error('Failed to load chores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChores();
  }, [currentHousehold]);

  const openCreateModal = () => {
    setEditingChore(null);
    setFormTitle('');
    setFormDescription('');
    setFormAssignedToId(currentUser?.id || '');
    setFormDifficulty('Medium');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormDueDate(tomorrow.toISOString().split('T')[0]);
    setFormPoints(10);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (chore) => {
    setEditingChore(chore);
    setFormTitle(chore.title);
    setFormDescription(chore.description || '');
    setFormAssignedToId(chore.assignedToId || '');
    setFormDifficulty(chore.difficulty || 'Medium');
    const d = chore.dueDate ? new Date(chore.dueDate).toISOString().split('T')[0] : '';
    setFormDueDate(d);
    setFormPoints(chore.points || 10);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveChore = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Chore title is required.');
      return;
    }

    try {
      const payload = {
        title: formTitle.trim(),
        description: formDescription,
        assignedToId: formAssignedToId ? Number(formAssignedToId) : null,
        difficulty: formDifficulty,
        dueDate: formDueDate ? `${formDueDate}T12:00:00` : null,
        points: Number(formPoints),
        recurring: true,
      };

      if (editingChore) {
        await choreService.updateChore(editingChore.id, payload);
      } else {
        await choreService.createChore(currentHousehold.id, payload);
      }

      setIsModalOpen(false);
      await loadChores();
    } catch (err) {
      setFormError(err.message || 'Failed to save chore.');
    }
  };

  const handleDeleteChore = async (id) => {
    if (window.confirm('Are you sure you want to delete this chore?')) {
      try {
        await choreService.deleteChore(id);
        await loadChores();
      } catch (err) {
        alert('Failed to delete chore: ' + err.message);
      }
    }
  };

  const handleToggleComplete = async (chore) => {
    try {
      if (chore.completed) {
        await choreService.reopenChore(chore.id);
      } else {
        await choreService.completeChore(chore.id, 'Done');
      }
      await loadChores();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Filter and search logic
  const filteredChores = chores.filter((chore) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Pending' && chore.status === 'Pending') ||
      (activeFilter === 'Completed' && chore.completed) ||
      (activeFilter === 'Overdue' && chore.status === 'Overdue');

    const matchesSearch =
      searchQuery.trim() === '' ||
      chore.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chore.assignedToName && chore.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const membersList = householdSummary?.members || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title="Chores"
        subtitle="Manage and track all household chores."
      />

      <div className="page-container">
        {/* Controls row: Filters + Search + Add button */}
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
          {/* Filter Pills */}
          <div className="filter-tabs">
            {['All', 'Pending', 'Completed', 'Overdue'].map((tab) => (
              <button
                key={tab}
                className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search chores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="btn btn-primary btn-pill" onClick={openCreateModal}>
              <Plus size={16} />
              <span>Add Chore</span>
            </button>
          </div>
        </div>

        {/* Chores Table / Card View */}
        {loading ? (
          <LoadingSpinner text="Loading chores..." />
        ) : filteredChores.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">
              <CheckCircle size={32} />
            </div>
            <h4>No chores found</h4>
            <p>
              {searchQuery
                ? 'No chores match your search query.'
                : activeFilter !== 'All'
                ? `No ${activeFilter.toLowerCase()} chores right now.`
                : 'Click "+ Add Chore" to create the first household task.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: 44 }}></th>
                  <th>Title</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChores.map((chore) => {
                  const isAssignedToMe = chore.assignedToId === currentUser?.id;
                  const assigneeDisplay = isAssignedToMe ? 'You' : chore.assignedToName || 'Unassigned';

                  return (
                    <tr key={chore.id}>
                      <td>
                        <button
                          onClick={() => handleToggleComplete(chore)}
                          style={{
                            color: chore.completed ? 'var(--color-mint-text)' : '#CBC7D8',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title={chore.completed ? 'Mark pending' : 'Mark completed'}
                          aria-label={chore.completed ? 'Mark pending' : 'Mark completed'}
                        >
                          {chore.completed ? (
                            <CheckCircle size={20} fill="#E0F4E9" />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                      </td>
                      <td>
                        <strong
                          style={{
                            fontSize: 14,
                            color: chore.completed ? 'var(--color-muted)' : 'var(--color-text)',
                            textDecoration: chore.completed ? 'line-through' : 'none',
                          }}
                        >
                          {chore.title}
                        </strong>
                        {chore.description && (
                          <span
                            style={{
                              display: 'block',
                              fontSize: 12,
                              color: 'var(--color-muted)',
                              marginTop: 2,
                            }}
                          >
                            {chore.description}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                          {assigneeDisplay}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                          {formatDate(chore.dueDate)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${(chore.difficulty || 'medium').toLowerCase()}`}>
                          {chore.difficulty || 'Medium'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-${
                            chore.completed
                              ? 'completed'
                              : chore.status === 'Overdue'
                              ? 'overdue'
                              : 'pending'
                          }`}
                        >
                          {chore.completed ? 'Completed' : chore.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-icon-only btn-outline"
                            onClick={() => openEditModal(chore)}
                            title="Edit Chore"
                            aria-label="Edit Chore"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="btn btn-icon-only btn-outline"
                            onClick={() => handleDeleteChore(chore.id)}
                            style={{ color: '#E8618C' }}
                            title="Delete Chore"
                            aria-label="Delete Chore"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT CHORE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingChore ? 'Edit Chore' : 'Add New Chore'}
      >
        {formError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger-text)',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSaveChore}>
          <div className="form-group">
            <label className="form-label">Chore Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Take out trash, Clean kitchen"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Provide any instructions or details..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select
                className="form-input"
                value={formAssignedToId}
                onChange={(e) => setFormAssignedToId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {membersList.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.displayName} {m.userId === currentUser?.id ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
            />
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingChore ? 'Save Changes' : 'Create Chore'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
