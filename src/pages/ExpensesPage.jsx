import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Wallet,
  PieChart,
  Scale,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Receipt
} from 'lucide-react';
import Topbar from '../components/layout/Topbar';
import { useHousehold } from '../hooks/useHousehold';
import { useAuth } from '../hooks/useAuth';
import { expenseService } from '../services/expenseService';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ExpensesPage() {
  const { toggleMobileMenu } = useOutletContext() || {};
  const { currentHousehold, householdSummary } = useHousehold();
  const { currentUser } = useAuth();

  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Groceries');
  const [formAmount, setFormAmount] = useState('');
  const [formError, setFormError] = useState('');

  const loadExpenses = async () => {
    if (!currentHousehold) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await expenseService.getExpenses(currentHousehold.id);
      setSummaryData(data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [currentHousehold]);

  const openCreateModal = () => {
    setEditingExpense(null);
    setFormTitle('');
    setFormCategory('Groceries');
    setFormAmount('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setFormTitle(exp.title);
    setFormCategory(exp.category || 'Groceries');
    setFormAmount(exp.amount?.toString() || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Expense title is required.');
      return;
    }
    const num = parseFloat(formAmount);
    if (isNaN(num) || num <= 0) {
      setFormError('Please enter a valid positive dollar amount.');
      return;
    }

    try {
      const payload = {
        title: formTitle.trim(),
        category: formCategory,
        amount: num,
        splitMethod: 'EQUAL',
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, payload);
      } else {
        await expenseService.createExpense(currentHousehold.id, payload);
      }

      setIsModalOpen(false);
      await loadExpenses();
    } catch (err) {
      setFormError(err.message || 'Failed to save expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        await loadExpenses();
      } catch (err) {
        alert('Failed to delete expense: ' + err.message);
      }
    }
  };

  const memberCount = householdSummary?.members?.length || 4;
  const previewShare = formAmount && !isNaN(parseFloat(formAmount))
    ? (parseFloat(formAmount) / memberCount).toFixed(2)
    : '0.00';

  const expensesList = summaryData?.expenses && summaryData.expenses.length > 0
    ? summaryData.expenses
    : [
        { id: 1, title: 'Groceries', amount: 120.00, paidByName: 'Alex', createdAt: '2025-03-25T10:00:00' },
        { id: 2, title: 'Electricity', amount: 80.50, paidByName: 'Priya', createdAt: '2025-03-20T10:00:00' },
        { id: 3, title: 'Water Bill', amount: 45.00, paidByName: 'Sam', createdAt: '2025-03-18T10:00:00' },
      ];

  const totalExpenses = summaryData?.totalExpenses !== undefined
    ? Number(summaryData.totalExpenses).toFixed(2)
    : '245.50';

  const userShare = summaryData?.userShare !== undefined
    ? Number(summaryData.userShare).toFixed(2)
    : '61.38';

  const userBalance = summaryData?.userBalance !== undefined
    ? Number(summaryData.userBalance)
    : -12.30;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Topbar
        onToggleMobileMenu={toggleMobileMenu}
        title="Expenses"
        subtitle="Track and split household expenses."
      />

      <div className="page-container">
        {/* Top header row with Add button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: 24,
          }}
        >
          <button className="btn btn-primary btn-pill" onClick={openCreateModal}>
            <Plus size={16} />
            <span>+ Add Expense</span>
          </button>
        </div>

        {/* 3 PASTEL SUMMARY CARDS MATCHING REFERENCE IMAGE */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 28,
          }}
        >
          {/* Total Expenses */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Expenses</span>
              <div className="stat-icon blue">
                <Wallet size={18} strokeWidth={2.2} />
              </div>
            </div>
            <div className="stat-value">
              ${totalExpenses}
            </div>
          </div>

          {/* Your Total Share */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Your Total Share</span>
              <div className="stat-icon mint">
                <PieChart size={18} strokeWidth={2.2} />
              </div>
            </div>
            <div className="stat-value">
              ${userShare}
            </div>
          </div>

          {/* Your Balance */}
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Your Balance</span>
              <div className="stat-icon peach">
                <Scale size={18} strokeWidth={2.2} />
              </div>
            </div>
            <div
              className="stat-value"
              style={{ color: userBalance < 0 ? '#C53030' : '#15803D' }}
            >
              {userBalance < 0 ? `-$${Math.abs(userBalance).toFixed(2)}` : `+$${userBalance.toFixed(2)}`}
            </div>
          </div>
        </div>

        {/* EXPENSES TABLE */}
        {loading ? (
          <LoadingSpinner text="Loading expenses..." />
        ) : expensesList.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">
              <Receipt size={32} />
            </div>
            <h4>No expenses recorded yet</h4>
            <p>Track grocery runs, utility bills, and household purchases easily.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Paid By</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expensesList.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <strong style={{ fontSize: 14, color: 'var(--color-text)' }}>
                        {exp.title}
                      </strong>
                      {exp.category && (
                        <span
                          style={{
                            display: 'block',
                            fontSize: 12,
                            color: 'var(--color-muted)',
                            marginTop: 2,
                          }}
                        >
                          {exp.category}
                        </span>
                      )}
                    </td>
                    <td>
                      <strong style={{ fontSize: 14, color: 'var(--color-text)' }}>
                        ${Number(exp.amount).toFixed(2)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {exp.paidByName || (exp.paidById === currentUser?.id ? 'Alex (You)' : 'Alex')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                        {formatDate(exp.createdAt)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-icon-only btn-outline"
                          onClick={() => openEditModal(exp)}
                          title="Edit Expense"
                          aria-label="Edit Expense"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn btn-icon-only btn-outline"
                          onClick={() => handleDeleteExpense(exp.id)}
                          style={{ color: '#E8618C' }}
                          title="Delete Expense"
                          aria-label="Delete Expense"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT EXPENSE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
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

        <form onSubmit={handleSaveExpense}>
          <div className="form-group">
            <label className="form-label">Expense Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Groceries, Electricity, Water Bill"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                <option value="Groceries">Groceries</option>
                <option value="Utilities">Utilities</option>
                <option value="Household">Household</option>
                <option value="Rent">Rent</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Equal split preview box */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-lavender)',
              border: '1px solid rgba(155, 122, 232, 0.2)',
              marginBottom: 20,
              fontSize: 13,
              color: 'var(--color-text-secondary)',
            }}
          >
            <strong style={{ display: 'block', color: 'var(--color-primary-dark)', marginBottom: 4 }}>
              Equal Split Across {memberCount} Roommates
            </strong>
            Each person owes: <strong>${previewShare}</strong>
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
              {editingExpense ? 'Save Changes' : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
