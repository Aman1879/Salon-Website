import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [inquiries, setInquiries] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showMessagesOnly, setShowMessagesOnly] = useState(false);
  const apiBase = "https://salon-website-5zml.onrender.com/api";

  useEffect(() => {
    const savedKey = sessionStorage.getItem('adminKey');
    if (savedKey) {
      setAdminKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !adminKey) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [inquiriesRes, messagesRes] = await Promise.all([
  axios.get(`${apiBase}/inquiries?key=${adminKey}`), // Removed /api
  axios.get(`${apiBase}/contact-messages?key=${adminKey}`) // Removed /api
]);
        setInquiries(inquiriesRes.data || []);
        setContactMessages(messagesRes.data || []);
      } catch (err) {
        const errorMsg = err?.response?.data?.error || 'Failed to load data';
        setError(errorMsg);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, adminKey]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!inputKey.trim()) {
      setLoginError('Please enter the admin key');
      return;
    }
    try {
     
await axios.get(`${apiBase}/inquiries?key=${inputKey}`); // Removed /api
      sessionStorage.setItem('adminKey', inputKey);
      setAdminKey(inputKey);
      setIsAuthenticated(true);
      setInputKey('');
    } catch (err) {
      setLoginError('Invalid admin key. Access denied.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(
  `${apiBase}/inquiries/${id}/status?key=${adminKey}`, // Removed /api
  { status: newStatus }
);
      setInquiries(inquiries.map(i => i.id === id ? res.data.inquiry : i));
    } catch (err) {
      setError(`Failed: ${err?.response?.data?.error || err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateContactStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(
  `${apiBase}/contact-messages/${id}/status?key=${adminKey}`, // Removed /api
  { status: newStatus }
);
      setContactMessages(contactMessages.map(m => m.id === id ? res.data.contactMessage : m));
    } catch (err) {
      setError(`Failed: ${err?.response?.data?.error || err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    setAdminKey('');
    setIsAuthenticated(false);
    setInquiries([]);
    setInputKey('');
    setLoginError('');
    setError(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
              <p className="text-gray-600">Enter your admin key to access the dashboard</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleLogin}>
                <div className="mb-6">
                  <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Key
                  </label>
                  <input
                    type="password"
                    id="adminKey"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter admin key"
                    autoComplete="off"
                  />
                </div>
                {loginError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    {loginError}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Login
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>This page is restricted to authorized personnel only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Derived: filtered data by search and message toggle
  const normalized = (v) => (v || '').toString().toLowerCase();
  const q = normalized(search);
  
  let filteredInquiries = inquiries;
  let filteredContactMessages = contactMessages;
  
  // Apply search filter for inquiries
  if (q) {
    filteredInquiries = filteredInquiries.filter(i => [
      i.name,
      i.email,
      i.phone,
      i.service,
      i.message,
      i.preferredDate,
      i.preferredTime,
      i.status
    ].some(field => normalized(field).includes(q)));
  }
  
  // Apply messages-only filter for inquiries
  if (showMessagesOnly) {
    filteredInquiries = filteredInquiries.filter(i => i.message && i.message.trim());
  }

  // Apply search filter for contact messages
  if (q) {
    filteredContactMessages = filteredContactMessages.filter(m => [
      m.name,
      m.email,
      m.phone,
      m.subject,
      m.message,
      m.status
    ].some(field => normalized(field).includes(q)));
  }

  const currentList = activeTab === 'bookings' ? filteredInquiries : filteredContactMessages;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <p className="text-gray-600">Manage booking requests and contact messages</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('bookings'); setSearch(''); setShowMessagesOnly(false); }}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'border-b-2 border-yellow-600 text-yellow-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Booking Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => { setActiveTab('contact'); setSearch(''); setShowMessagesOnly(false); }}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'contact'
                ? 'border-b-2 border-yellow-600 text-yellow-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Contact Messages ({contactMessages.length})
          </button>
        </div>

        {/* Toolbar: search + message filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === 'bookings' ? "Search name, message, service, email..." : "Search name, subject, email..."}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-500 whitespace-nowrap">{currentList.length} result{currentList.length !== 1 ? 's' : ''}</div>
          </div>
          {activeTab === 'bookings' && (
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  checked={showMessagesOnly}
                  onChange={(e) => setShowMessagesOnly(e.target.checked)}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">Show with messages only</span>
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-100 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeTab === 'bookings' ? (
              // Booking Inquiries
              filteredInquiries.length === 0 ? (
                <div className="text-center text-gray-600">No bookings found.</div>
              ) : filteredInquiries.map(i => {
                const statusColors = {
                  accepted: 'bg-green-100 text-green-800',
                  rejected: 'bg-red-100 text-red-800',
                  pending: 'bg-yellow-100 text-yellow-800'
                };
                return (
                <div key={i.id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-bold text-lg">{i.name}</div>
                      <div className="text-sm text-gray-500">{i.email} • {i.phone}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(i.createdAt).toLocaleString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-medium text-sm ${statusColors[i.status]}`}>
                      {i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4 text-sm text-gray-700 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <div className="text-gray-500 text-xs font-semibold">SERVICE</div>
                      <div className="font-medium">{i.service}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-semibold">DATE</div>
                      <div className="font-medium">{i.preferredDate}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-semibold">TIME</div>
                      <div className="font-medium">{i.preferredTime}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs font-semibold">PEOPLE</div>
                      <div className="font-medium">{i.numberOfPeople || 1}</div>
                    </div>
                  </div>

                  {i.message && (
                    <div className="mb-6 border-l-4 border-gray-300 pl-4">
                      <div className="text-gray-500 text-xs font-semibold mb-1">MESSAGE</div>
                      <div className="text-gray-700">{i.message}</div>
                    </div>
                  )}

                  {i.status === 'pending' ? (
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleUpdateStatus(i.id, 'rejected')}
                        disabled={updatingId === i.id}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg disabled:opacity-50 transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(i.id, 'accepted')}
                        disabled={updatingId === i.id}
                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg disabled:opacity-50 transition"
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleUpdateStatus(i.id, 'pending')}
                        disabled={updatingId === i.id}
                        className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold rounded-lg disabled:opacity-50 transition"
                      >
                        Revert to Pending
                      </button>
                    </div>
                  )}
                </div>
              );})
            ) : (
              // Contact Messages
              filteredContactMessages.length === 0 ? (
                <div className="text-center text-gray-600">No contact messages found.</div>
              ) : filteredContactMessages.map(m => {
                const statusColors = {
                  unread: 'bg-blue-100 text-blue-800',
                  replied: 'bg-green-100 text-green-800'
                };
                return (
                <div key={m.id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="font-bold text-lg">{m.name}</div>
                      <div className="text-sm text-gray-500">{m.email}{m.phone ? ` • ${m.phone}` : ''}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-medium text-sm ${statusColors[m.status]}`}>
                      {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-500 text-xs font-semibold mb-1">SUBJECT</div>
                    <div className="font-semibold text-gray-800">{m.subject}</div>
                  </div>

                  <div className="mb-6 border-l-4 border-yellow-400 pl-4">
                    <div className="text-gray-500 text-xs font-semibold mb-1">MESSAGE</div>
                    <div className="text-gray-700">{m.message}</div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => handleUpdateContactStatus(m.id, m.status === 'unread' ? 'replied' : 'unread')}
                      disabled={updatingId === m.id}
                      className={`px-4 py-2 font-semibold rounded-lg disabled:opacity-50 transition ${
                        m.status === 'unread'
                          ? 'bg-green-100 hover:bg-green-200 text-green-700'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                    >
                      {m.status === 'unread' ? 'Mark as Replied' : 'Mark as Unread'}
                    </button>
                  </div>
                </div>
              );})
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
