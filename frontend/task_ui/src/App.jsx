// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Trophy, Users, History, Plus, Award, Star, Clock } from 'lucide-react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// function App() {
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [pointHistory, setPointHistory] = useState([]);
//   const [pointsGiven, setPointsGiven] = useState(null);
//   const [newUser, setNewUser] = useState('');
//   const [activeTab, setActiveTab] = useState('claim');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//     fetchLeaderboard();
//     fetchPointHistory();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/users`);
//       setUsers(res.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const fetchLeaderboard = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/leaderboard`);
//       setLeaderboard(res.data);
//     } catch (error) {
//       console.error('Error fetching leaderboard:', error);
//     }
//   };

//   const fetchPointHistory = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/history`);
//       const formatted = res.data.map(item => ({
//         _id: item._id,
//         userId: item.userId._id,
//         userName: item.userId.name,
//         points: item.pointsClaimed,
//         timestamp: item.claimedAt
//       }));
//       setPointHistory(formatted);
//     } catch (error) {
//       console.error('Error fetching point history:', error);
//     }
//   };

//   const handleClaim = async () => {
//     if (!selectedUserId) return alert('Please select a user');
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/claim`, { userId: selectedUserId });
//       setPointsGiven(res.data.points);
//       await fetchUsers();
//       await fetchLeaderboard();
//       await fetchPointHistory();
//       setTimeout(() => setPointsGiven(null), 3000);
//     } catch (error) {
//       console.error('Error claiming points:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddUser = async () => {
//     if (!newUser.trim()) return;
//     setLoading(true);
//     try {
//       await axios.post(`${API_BASE_URL}/users`, { name: newUser });
//       setNewUser('');
//       fetchUsers();
//     } catch (error) {
//       console.error('Error adding user:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (timestamp) => {
//     return new Date(timestamp).toLocaleString();
//   };

//   const getRankIcon = (index) => {
//     if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
//     if (index === 1) return <Award className="w-5 h-5 text-gray-400" />;
//     if (index === 2) return <Star className="w-5 h-5 text-orange-500" />;
//     return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-semibold">{index + 1}</span>;
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto font-sans">
//       <div className="flex gap-4 mb-6">
//         {['claim', 'leaderboard', 'history', 'users'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-full ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//           >
//             {tab.toUpperCase()}
//           </button>
//         ))}
//       </div>

//       {/* CLAIM TAB */}
//       {activeTab === 'claim' && (
//         <div className="space-y-4">
//           <select
//             value={selectedUserId}
//             onChange={e => setSelectedUserId(e.target.value)}
//             className="border p-2 w-full"
//           >
//             <option value="">-- Select User --</option>
//             {users.map(user => (
//               <option key={user._id} value={user._id}>{user.name}</option>
//             ))}
//           </select>
//           <button onClick={handleClaim} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
//             {loading ? 'Claiming...' : 'Claim Points'}
//           </button>
//           {pointsGiven && <p className="text-green-600 font-bold">🎉 Claimed {pointsGiven} points!</p>}
//         </div>
//       )}

//       {/* LEADERBOARD TAB */}
//       {activeTab === 'leaderboard' && (
//         <ol className="mt-4 list-decimal pl-6 space-y-2">
//           {leaderboard.map((user, i) => (
//             <li key={user._id}>
//               {getRankIcon(i)} {user.name} — <b>{user.totalPoints}</b> pts
//             </li>
//           ))}
//         </ol>
//       )}

//       {/* HISTORY TAB */}
//       {activeTab === 'history' && (
//         <table className="w-full mt-4 border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">User</th>
//               <th className="border p-2">Points</th>
//               <th className="border p-2">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pointHistory.map(entry => (
//               <tr key={entry._id}>
//                 <td className="border p-2">{entry.userName}</td>
//                 <td className="border p-2">+{entry.points}</td>
//                 <td className="border p-2"><Clock className="inline w-4 h-4" /> {formatDate(entry.timestamp)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* USERS TAB */}
//       {activeTab === 'users' && (
//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="New User"
//               value={newUser}
//               onChange={e => setNewUser(e.target.value)}
//               className="border p-2 flex-1"
//             />
//             <button onClick={handleAddUser} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
//               Add
//             </button>
//           </div>
//           <ul className="list-disc ml-6">
//             {users.map(user => (
//               <li key={user._id}>{user.name} — <b>{user.totalPoints}</b> pts</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;




import React, { useEffect, useState } from 'react';
import { Trophy, Users, History, Plus, Award, Star, Clock, Zap, TrendingUp, Gift, Medal, User, ChevronRight, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  const [pointsGiven, setPointsGiven] = useState(null);
  const [newUser, setNewUser] = useState('');
  const [activeTab, setActiveTab] = useState('claim');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
    fetchPointHistory();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/leaderboard`);
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPointHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (!res.ok) throw new Error('Failed to fetch point history');
      const data = await res.json();
      const formatted = data.map(item => ({
        _id: item._id,
        userId: item.userId._id,
        userName: item.userId.name,
        points: item.pointsClaimed,
        timestamp: item.claimedAt
      }));
      setPointHistory(formatted);
    } catch (error) {
      console.error('Error fetching point history:', error);
      setError('Failed to load point history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedUserId) return alert('Please select a user');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });
      if (!res.ok) throw new Error('Failed to claim points');
      const data = await res.json();
      setPointsGiven(data.points);
      await Promise.all([fetchUsers(), fetchLeaderboard(), fetchPointHistory()]);
      setTimeout(() => setPointsGiven(null), 3000);
    } catch (error) {
      console.error('Error claiming points:', error);
      setError('Failed to claim points. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) return alert('Please enter a user name');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUser }),
      });
      if (!res.ok) throw new Error('Failed to add user');
      setNewUser('');
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 font-bold text-sm">{index + 1}</div>;
  };

  const getRankBadge = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg";
    if (index === 1) return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-lg";
    if (index === 2) return "bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg";
    return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200";
  };

  // Chart data preparation
  const chartData = users.map(user => ({
    name: user.name.split(' ')[0],
    points: user.totalPoints
  }));

  const pieData = users.map(user => ({
    name: user.name,
    value: user.totalPoints
  }));

  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  const tabs = [
    { id: 'claim', label: 'Claim Points', icon: Zap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'users', label: 'Users', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Points Hub
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Track achievements and claim your rewards</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-700">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8 p-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex-1 min-w-0 text-xs sm:text-sm lg:text-base ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* CLAIM TAB */}
          {activeTab === 'claim' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Claim Your Points</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Select a user and claim your daily points</p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                    <select
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
                      disabled={loading}
                    >
                      <option value="">Choose a user...</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleClaim}
                    disabled={loading || !selectedUserId}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Claiming...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        Claim Points
                      </div>
                    )}
                  </button>

                  {pointsGiven && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 text-center animate-pulse">
                      <div className="text-2xl sm:text-4xl mb-2">🎉</div>
                      <p className="text-base sm:text-lg font-bold text-green-700">
                        Successfully claimed {pointsGiven} points!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-4">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Leaderboard</h2>
                <p className="text-gray-600 text-sm sm:text-base">Top performers and their achievements</p>
              </div>

              {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user._id}
                      className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${getRankBadge(index)}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {getRankIcon(index)}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base lg:text-lg truncate">{user.name}</h3>
                          <p className="text-xs sm:text-sm opacity-75">
                            {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : index === 2 ? 'Third Place' : 'Participant'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold">{user.totalPoints}</div>
                        <div className="text-xs sm:text-sm opacity-75">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600 text-sm sm:text-base">Visual representation of points distribution</p>
              </div>

              {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : (
                <div className="space-y-6 sm:space-y-8">
                  {/* Bar Chart */}
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Points by User</h3>
                    <div className="h-64 sm:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="points" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Pie Chart and Area Chart */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Points Distribution</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Performance Trend</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12 }}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="points" 
                              stroke="#8B5CF6" 
                              fill="#8B5CF6" 
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Total Users</p>
                          <p className="text-2xl sm:text-3xl font-bold">{users.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Total Points</p>
                          <p className="text-2xl sm:text-3xl font-bold">{users.reduce((sum, user) => sum + user.totalPoints, 0)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Average Points</p>
                          <p className="text-2xl sm:text-3xl font-bold">{Math.round(users.reduce((sum, user) => sum + user.totalPoints, 0) / users.length) || 0}</p>
                        </div>
                        <Star className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Top Score</p>
                          <p className="text-2xl sm:text-3xl font-bold">{Math.max(...users.map(u => u.totalPoints)) || 0}</p>
                        </div>
                        <Trophy className="w-8 h-8 text-orange-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                  <History className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Points History</h2>
                <p className="text-gray-600 text-sm sm:text-base">Recent point claims and activities</p>
              </div>

              {loading ? (
                <div className="text-center text-gray-600">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider rounded-l-lg">User</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider rounded-r-lg">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pointHistory.map((entry, index) => (
                        <tr key={entry._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <div className="font-medium text-gray-900 text-sm sm:text-base">{entry.userName}</div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium text-sm">
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              +{entry.points}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-500 text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {formatDate(entry.timestamp)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Manage Users</h2>
                <p className="text-gray-600 text-sm sm:text-base">Add new users and view all participants</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {/* Add User Form */}
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Add New User</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Enter user name..."
                      value={newUser}
                      onChange={e => setNewUser(e.target.value)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      disabled={loading}
                    />
                    <button
                      onClick={handleAddUser}
                      disabled={loading || !newUser.trim()}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Adding...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          Add User
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Users List */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">All Users</h3>
                  {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {users.map(user => (
                        <div 
                          key={user._id} 
                          className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.name}</h4>
                              <p className="text-xs sm:text-sm text-gray-500">Active participant</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <div>
                              <div className="font-bold text-sm sm:text-base lg:text-lg text-gray-900">{user.totalPoints}</div>
                              <div className="text-xs sm:text-sm text-gray-500">points</div>
                            </div>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;