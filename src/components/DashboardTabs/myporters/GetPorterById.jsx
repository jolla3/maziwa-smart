import React, { useState } from 'react';
import axios from 'axios';

const GetPorterById = () => {
  const [id, setId] = useState('');
  const [porter, setPorter] = useState(null);

  const handleFetch = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://maziwasmart.onrender.com/api/porters//${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPorter(res.data);
    } catch (err) {
      alert('Not found');
      setPorter(null);
    }
  };

  return (
    <div>
      <input placeholder="Enter Porter ID" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={handleFetch}>Fetch</button>
      {porter && (
        <div>
          <p>Name: {porter.name}</p>
          <p>Phone: {porter.phone}</p>
        </div>
      )}
    </div>
  );
};

export default GetPorterById;
