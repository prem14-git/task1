import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [pointsGiven, setPointsGiven] = useState(null);
  const [newUser, setNewUser] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/users');
    setUsers(res.data);
  };

  const fetchLeaderboard = async () => {
    const res = await axios.get('http://localhost:5000/api/leaderboard');
    setLeaderboard(res.data);
  };

  const handleClaim = async () => {
    if (!selectedUserId) return alert('Select a user');
    const res = await axios.post('http://localhost:5000/api/claim', { userId: selectedUserId });
    setPointsGiven(res.data.points);
    fetchLeaderboard();
    fetchUsers();
  };

  const handleAddUser = async () => {
    if (!newUser) return;
    await axios.post('http://localhost:5000/api/users', { name: newUser });
    setNewUser('');
    fetchUsers();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Points Claim System</h2>

      <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
        <option value=''>-- Select User --</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>
      <button onClick={handleClaim}>Claim</button>

      {pointsGiven && <p>🎉 Claimed {pointsGiven} points!</p>}

      <div style={{ marginTop: '30px' }}>
        <h3>Add New User</h3>
        <input value={newUser} onChange={e => setNewUser(e.target.value)} />
        <button onClick={handleAddUser}>Add</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>🏆 Leaderboard</h3>
        <ol>
          {leaderboard.map((user, index) => (
            <li key={user._id}>{user.name} - {user.totalPoints} pts</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;