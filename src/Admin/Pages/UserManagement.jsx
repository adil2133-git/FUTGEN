import React, { useState, useEffect } from 'react';
import { api } from '../../Api/Axios';
import Dashboard from '../Component/Dashboard';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const statusOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active' },
    { value: 'blocked', label: 'Blocked' }
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let filtered = users.filter(user => {
      const fullName = `${user.firstName || user.Fname || ''} ${user.lastName || user.Lname || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || 
                           (selectedStatus === 'active' && !user.blocked) ||
                           (selectedStatus === 'blocked' && user.blocked);
      
      return matchesSearch && matchesStatus;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = `${a.firstName || a.Fname} ${a.lastName || a.Lname}`.toLowerCase();
        const nameB = `${b.firstName || b.Fname} ${b.lastName || b.Lname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'email') return a.email.localeCompare(b.email);
      if (sortBy === 'status') {
        if (a.blocked === b.blocked) return 0;
        return a.blocked ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedStatus, sortBy]);

  const handleBlockUser = async (userId, currentStatus) => {
    if (currentStatus) {
      if (!window.confirm('Are you sure you want to unblock this user?')) return;
    } else {
      if (!window.confirm('Are you sure you want to block this user?')) return;
    }

    try {
      await api.patch(`/users/${userId}`, { blocked: !currentStatus });
      await fetchUsers();
      alert(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully!`);
    } catch (error) {
      alert('Error updating user status');
    }
  };

  const getUserDisplayName = (user) => {
    return `${user.firstName || user.Fname || ''} ${user.lastName || user.Lname || ''}`.trim();
  };

  const getUserInitials = (user) => {
    const firstName = user.firstName || user.Fname || '';
    const lastName = user.lastName || user.Lname || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getStatusCounts = () => {
    const active = users.filter(user => !user.blocked).length;
    const blocked = users.filter(user => user.blocked).length;
    return { active, blocked };
  };

  const statusCounts = getStatusCounts();

  return (
    <Dashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
            <p className="text-2xl font-bold text-red-600">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
            <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Blocked Users</h3>
            <p className="text-2xl font-bold text-red-600">{statusCounts.blocked}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800">Admins</h3>
            <p className="text-2xl font-bold text-blue-600">
              {users.filter(user => user.role === 'admin').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search by name or email..." 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
            />
            
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
            </select>

            <button 
              onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSortBy('name'); }} 
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              user.blocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {getUserInitials(user)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getUserDisplayName(user)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.blocked 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.blocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleBlockUser(user.id, user.blocked)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            user.blocked
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
}

export default UserManagement;