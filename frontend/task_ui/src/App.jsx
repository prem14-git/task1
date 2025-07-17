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
import { Trophy, Users, History, Plus, Award, Star, Clock, Zap, TrendingUp, Gift, Medal, User, ChevronRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [pointHistory, setPointHistory] = useState([]);
  const [pointsGiven, setPointsGiven] = useState(null);
  const [newUser, setNewUser] = useState('');
  const [activeTab, setActiveTab] = useState('claim');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
    fetchPointHistory();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/leaderboard`);
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const fetchPointHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
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
    }
  };

  const handleClaim = async () => {
    if (!selectedUserId) return alert('Please select a user');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: selectedUserId }),
      });
      const data = await res.json();
      setPointsGiven(data.points);
      await fetchUsers();
      await fetchLeaderboard();
      await fetchPointHistory();
      setTimeout(() => setPointsGiven(null), 3000);
    } catch (error) {
      console.error('Error claiming points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUser }),
      });
      setNewUser('');
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 font-bold text-sm">{index + 1}</div>;
  };

  const getRankBadge = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (index === 1) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (index === 2) return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200";
  };

  const tabs = [
    { id: 'claim', label: 'Claim Points', icon: Zap },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'history', label: 'History', icon: History },
    { id: 'users', label: 'Users', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Points Hub
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Track achievements and claim your rewards</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 bg-white rounded-2xl shadow-lg border border-gray-100">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex-1 min-w-0 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* CLAIM TAB */}
          {activeTab === 'claim' && (
            <div className="p-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Claim Your Points</h2>
                  <p className="text-gray-600">Select a user and claim your daily points</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                    <select
                      value={selectedUserId}
                      onChange={e => setSelectedUserId(e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
                    className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Claiming...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5" />
                        Claim Points
                      </div>
                    )}
                  </button>

                  {pointsGiven && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 text-center animate-pulse">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="text-lg font-bold text-green-700">
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
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h2>
                <p className="text-gray-600">Top performers and their achievements</p>
              </div>

              <div className="space-y-4">
                {leaderboard.map((user, index) => (
                  <div
                    key={user._id}
                    className={`flex items-center gap-4 p-6 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${getRankBadge(index)}`}
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(index)}
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-sm opacity-75">
                          {index === 0 ? 'Champion' : index === 1 ? 'Runner-up' : index === 2 ? 'Third Place' : 'Participant'}
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-bold">{user.totalPoints}</div>
                      <div className="text-sm opacity-75">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4">
                  <History className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Points History</h2>
                <p className="text-gray-600">Recent point claims and activities</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider rounded-l-lg">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider rounded-r-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pointHistory.map((entry, index) => (
                      <tr key={entry._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="font-medium text-gray-900">{entry.userName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                            <TrendingUp className="w-4 h-4" />
                            +{entry.points}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {formatDate(entry.timestamp)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Users</h2>
                <p className="text-gray-600">Add new users and view all participants</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-8">
                {/* Add User Form */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter user name..."
                      value={newUser}
                      onChange={e => setNewUser(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddUser}
                      disabled={loading || !newUser.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Users List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">All Users</h3>
                  <div className="space-y-3">
                    {users.map(user => (
                      <div key={user._id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-500">Active participant</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">{user.totalPoints}</div>
                            <div className="text-sm text-gray-500">points</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
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