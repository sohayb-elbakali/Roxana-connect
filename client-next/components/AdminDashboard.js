'use client';

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { api } from "../lib/utils";

const AdminDashboard = ({ users: { user } }) => {
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterVerified, setFilterVerified] = useState("");

  // Confirmation modals
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    type: '', // 'role' or 'level' or 'delete'
    userId: null,
    userName: '',
    currentValue: '',
    newValue: ''
  });

  useEffect(() => {
    fetchStats();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, filterRole, filterLevel, filterVerified]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole && { role: filterRole }),
        ...(filterLevel && { level: filterLevel }),
        ...(filterVerified && { verified: filterVerified }),
      });

      const res = await api.get(`/admin/users?${params}`);
      setAllUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 403) {
        alert("Access denied. Admin privileges required.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = (type, userId, userName, currentValue, newValue) => {
    setConfirmModal({
      show: true,
      type,
      userId,
      userName,
      currentValue,
      newValue
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({
      show: false,
      type: '',
      userId: null,
      userName: '',
      currentValue: '',
      newValue: ''
    });
  };

  const confirmAction = async () => {
    const { type, userId, newValue } = confirmModal;

    try {
      if (type === 'role') {
        await api.put(`/admin/users/${userId}/role`, { role: newValue });
      } else if (type === 'level') {
        await api.put(`/admin/users/${userId}/level`, { level: parseInt(newValue) });
      } else if (type === 'delete') {
        await api.delete(`/admin/users/${userId}`);
      }

      fetchUsers();
      fetchStats();
      closeConfirmation();
    } catch (err) {
      console.error(`Error ${type}:`, err);
      alert(err.response?.data?.msg || `Error performing ${type} action`);
      closeConfirmation();
    }
  };

  const handleRoleChange = (e, userId, userName, currentRole) => {
    const newRole = e.target.value;
    if (newRole !== currentRole) {
      showConfirmation('role', userId, userName, currentRole, newRole);
      e.target.value = currentRole; // Reset select until confirmed
    }
  };

  const handleLevelChange = (e, userId, userName, currentLevel) => {
    const newLevel = e.target.value;
    if (newLevel !== currentLevel.toString()) {
      showConfirmation('level', userId, userName, currentLevel, newLevel);
      e.target.value = currentLevel; // Reset select until confirmed
    }
  };

  const handleDeleteUser = (userId, userName) => {
    showConfirmation('delete', userId, userName, '', '');
  };

  const getLevelBadgeColor = (level) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-700 border-green-200";
      case 2:
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 3:
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleBadgeColor = (role) => {
    return role === "admin"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (user?.role !== "admin") {
    return (
      <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <i className="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
            <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
            <p className="text-red-700">You do not have admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pl-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-shield text-red-600"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-sm text-gray-600">
                Manage users, roles, and levels • {stats?.totalUsers || 0} total users
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Total Users</span>
                <i className="fas fa-users text-blue-600"></i>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Admin Users</span>
                <i className="fas fa-user-shield text-red-600"></i>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.adminUsers}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Regular Users</span>
                <i className="fas fa-user text-gray-600"></i>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.regularUsers}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">Verified Users</span>
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.verifiedUsers || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 text-sm font-semibold">Level 1</span>
                <i className="fas fa-star text-green-600"></i>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.level1Users}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-700 text-sm font-semibold">Level 2</span>
                <i className="fas fa-star text-blue-600"></i>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.level2Users}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-700 text-sm font-semibold">Level 3</span>
                <i className="fas fa-star text-purple-600"></i>
              </div>
              <p className="text-3xl font-bold text-purple-900">{stats.level3Users}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-search mr-2"></i>Search
              </label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-user-tag mr-2"></i>Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-layer-group mr-2"></i>Filter by Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => {
                  setFilterLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-check-circle mr-2"></i>Filter by Status
              </label>
              <select
                value={filterVerified}
                onChange={(e) => {
                  setFilterVerified(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#BFDBFE]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        {u.profile?.bio && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {u.profile.bio}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{u.email}</div>
                        {u.profile?.location && (
                          <div className="text-xs text-gray-500">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {u.profile.location}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                            <i className="fas fa-check-circle mr-1"></i>
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <i className="fas fa-clock mr-1"></i>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(e, u._id, u.name, u.role)}
                          disabled={u._id === user._id}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${getRoleBadgeColor(
                            u.role
                          )} focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.role === 'admin' ? (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                            N/A
                          </span>
                        ) : (
                          <select
                            value={u.level || 1}
                            onChange={(e) => handleLevelChange(e, u._id, u.name, u.level || 1)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border ${getLevelBadgeColor(
                              u.level
                            )} focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                          >
                            <option value="1">Level 1</option>
                            <option value="2">Level 2</option>
                            <option value="3">Level 3</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={u._id === user._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete user"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <i className="fas fa-chevron-right ml-2"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmModal.show && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {confirmModal.type === 'delete' ? 'Confirm Deletion' : 'Confirm Change'}
                </h3>
                <div className="text-sm text-gray-600">
                  {confirmModal.type === 'role' && (
                    <>
                      <p className="mb-2">Are you sure you want to change the role of:</p>
                      <p className="font-semibold text-gray-900 mb-2">{confirmModal.userName}</p>
                      <p>
                        From: <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(confirmModal.currentValue)}`}>
                          {confirmModal.currentValue}
                        </span>
                        {' → '}
                        To: <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(confirmModal.newValue)}`}>
                          {confirmModal.newValue}
                        </span>
                      </p>
                      {confirmModal.newValue === 'admin' && (
                        <p className="mt-3 text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                          <i className="fas fa-exclamation-triangle mr-2"></i>
                          Note: Admins don't have levels. The user's level will be removed.
                        </p>
                      )}
                    </>
                  )}
                  {confirmModal.type === 'level' && (
                    <>
                      <p className="mb-2">Are you sure you want to change the level of:</p>
                      <p className="font-semibold text-gray-900 mb-2">{confirmModal.userName}</p>
                      <p>
                        From: <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelBadgeColor(confirmModal.currentValue)}`}>
                          Level {confirmModal.currentValue}
                        </span>
                        {' → '}
                        To: <span className={`px-2 py-1 rounded text-xs font-semibold ${getLevelBadgeColor(parseInt(confirmModal.newValue))}`}>
                          Level {confirmModal.newValue}
                        </span>
                      </p>
                    </>
                  )}
                  {confirmModal.type === 'delete' && (
                    <>
                      <p className="mb-2">Are you sure you want to delete:</p>
                      <p className="font-semibold text-gray-900 mb-2">{confirmModal.userName}</p>
                      <p className="text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        This action cannot be undone! All user data including their profile will be permanently deleted.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeConfirmation}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${confirmModal.type === 'delete'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {confirmModal.type === 'delete' ? 'Delete' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default connect(mapStateToProps)(AdminDashboard);
