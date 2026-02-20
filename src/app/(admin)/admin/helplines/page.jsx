'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CATEGORIES = [
  'Police',
  'Women Helpline',
  'Child Helpline',
  'Medical Emergency',
  'Fire',
  'Disaster Management',
  'Other',
];

const INDIAN_STATES = [
  'ANDHRA PRADESH',
  'ARUNACHAL PRADESH',
  'ASSAM',
  'BIHAR',
  'CHHATTISGARH',
  'GOA',
  'GUJARAT',
  'HARYANA',
  'HIMACHAL PRADESH',
  'JHARKHAND',
  'KARNATAKA',
  'KERALA',
  'MADHYA PRADESH',
  'MAHARASHTRA',
  'MANIPUR',
  'MEGHALAYA',
  'MIZORAM',
  'NAGALAND',
  'ODISHA',
  'PUNJAB',
  'RAJASTHAN',
  'SIKKIM',
  'TAMIL NADU',
  'TELANGANA',
  'TRIPURA',
  'UTTAR PRADESH',
  'UTTARAKHAND',
  'WEST BENGAL',
  'ANDAMAN AND NICOBAR ISLANDS',
  'CHANDIGARH',
  'DADRA AND NAGAR HAVELI AND DAMAN AND DIU',
  'DELHI',
  'JAMMU AND KASHMIR',
  'LADAKH',
  'LAKSHADWEEP',
  'PUDUCHERRY',
];

export default function AdminHelplinesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    state: '',
    category: '',
    phoneNumber: '',
    description: '',
    isActive: true,
  });

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'admin') {
      router.push('/login');
    }
  }, [session, status, router]);

  // Fetch helplines on mount
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchHelplines();
    }
  }, [session, filterState, filterCategory]);

  const fetchHelplines = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterState) params.append('state', filterState);
      if (filterCategory) params.append('category', filterCategory);

      const response = await fetch(`/api/admin/helplines?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch helplines');
      }

      setHelplines(data.helplines || []);
      setError('');
    } catch (err) {
      console.error('Fetch helplines error:', err);
      setError(err.message || 'Failed to load helplines');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      state: '',
      category: '',
      phoneNumber: '',
      description: '',
      isActive: true,
    });
    setEditingId(null);
    setIsAdding(false);
    setError('');
    setSuccess('');
  };

  const handleAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleEdit = (helpline) => {
    setFormData({
      state: helpline.state,
      category: helpline.category,
      phoneNumber: helpline.phoneNumber,
      description: helpline.description || '',
      isActive: helpline.isActive,
    });
    setEditingId(helpline.id);
    setIsAdding(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.state || !formData.category || !formData.phoneNumber) {
      setError('State, category, and phone number are required');
      return;
    }

    try {
      if (editingId) {
        // Update existing helpline
        const response = await fetch(`/api/admin/helplines/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update helpline');
        }

        setSuccess('Helpline updated successfully');
      } else {
        // Create new helpline
        const response = await fetch('/api/admin/helplines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create helpline');
        }

        setSuccess('Helpline created successfully');
      }

      resetForm();
      fetchHelplines();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to save helpline');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this helpline?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/helplines/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete helpline');
      }

      setSuccess('Helpline deleted successfully');
      fetchHelplines();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete helpline');
    }
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f8] dark:bg-[#181121]">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="bg-[#f7f6f8] dark:bg-[#181121] font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Helpline Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage emergency helplines by state and category
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Filter by State
            </label>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#8b47eb]"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#8b47eb]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Button */}
        {!isAdding && (
          <button
            onClick={handleAdd}
            className="mb-6 px-6 py-3 bg-[#8b47eb] text-white font-semibold rounded-lg hover:bg-[#8b47eb]/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Helpline
          </button>
        )}

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {editingId ? 'Edit Helpline' : 'Add New Helpline'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#8b47eb]"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#8b47eb]"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  required
                  placeholder="e.g., 100, 1091, +91-XXX-XXX-XXXX"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8b47eb]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Additional information about this helpline"
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8b47eb] resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#8b47eb] focus:ring-[#8b47eb]"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Active (visible to users)
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#8b47eb] text-white font-semibold hover:bg-[#8b47eb]/90 transition-colors"
                >
                  {editingId ? 'Update' : 'Create'} Helpline
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Helplines List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b47eb]"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Loading helplines...
            </p>
          </div>
        ) : helplines.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
              phone_disabled
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              No helplines found. Add your first helpline to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {helplines.map((helpline) => (
              <div
                key={helpline.id}
                className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border ${
                  helpline.isActive
                    ? 'border-slate-100 dark:border-slate-700'
                    : 'border-slate-200 dark:border-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        {helpline.category}
                      </h3>
                      {!helpline.isActive && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {helpline.state}
                    </p>
                    {helpline.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
                        {helpline.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleCall(helpline.phoneNumber)}
                        className="px-4 py-1.5 bg-[#8b47eb]/10 text-[#8b47eb] font-semibold rounded-lg hover:bg-[#8b47eb]/20 transition-colors flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">
                          call
                        </span>
                        {helpline.phoneNumber}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(helpline)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#8b47eb] hover:bg-[#8b47eb]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(helpline.id)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
