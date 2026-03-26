import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [scores, setScores] = useState([]);
  const [score, setScore] = useState('');
  const [draw, setDraw] = useState([]);

  const signup = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const res = await fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);
  };

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      alert("Login successful");
    } else {
      alert(data.message || "Login failed");
    }
  };

  const addScore = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    if (!score) {
      alert("Enter a score");
      return;
    }

    if (score < 1 || score > 45) {
      alert("Score must be between 1 and 45");
      return;
    }

    const res = await fetch('http://localhost:5000/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ score: Number(score) })
    });

    const data = await res.json();
    setScores(data);
  };

  const getScores = async () => {
    const res = await fetch('http://localhost:5000/scores', {
      headers: { 'Authorization': token }
    });

    const data = await res.json();
    setScores(data);
  };

  const getDraw = async () => {
    const res = await fetch('http://localhost:5000/draw');
    const data = await res.json();
    setDraw(data.winning);
  };

 return (
  <div style={{ padding: 20 }}>
    <h1>🏌️ Golf Charity Platform</h1>

    <h3>Signup / Login</h3>

    <input 
      placeholder="Email" 
      onChange={e => setEmail(e.target.value)} 
    />

    <input 
      type="password" 
      placeholder="Password" 
      onChange={e => setPassword(e.target.value)} 
    />

    <br /><br />

    <button onClick={signup}>Signup</button>
    <button onClick={login}>Login</button>

    <h3>Add Score</h3>

    <input 
      placeholder="Enter score (1-45)" 
      onChange={e => setScore(e.target.value)} 
    />

    <button onClick={addScore}>Add Score</button>
    <button onClick={getScores}>Refresh Scores</button>

    <h3>Your Last 5 Scores</h3>

    {scores.length === 0 ? (
      <p>No scores yet</p>
    ) : (
      <ul>
        {scores.map((s, i) => (
          <li key={i}>
            Score: {s.score} | Date: {new Date(s.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    )}

    <h3>Monthly Draw</h3>

    <button onClick={getDraw}>Run Draw</button>

    {draw.length > 0 && (
      <ul>
        {draw.map((num, i) => (
          <li key={i}>{num}</li>
        ))}
      </ul>
    )}
  </div>
);
}

export default App;