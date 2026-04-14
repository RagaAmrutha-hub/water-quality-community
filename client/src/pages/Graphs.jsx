import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Graphs() {
  const { user } = useAuth();
  const [userParameters, setUserParameters] = useState(null);

  useEffect(() => {
    const fetchLatestReading = async () => {
      try {
        const response = await axios.get('/api/water', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        
        if (response.data && response.data.length > 0) {
          const latest = response.data[0];
          
          // Parse numericals, providing fallback estimates if the user inputted pure text 
          // (e.g. string "pink" becomes numeric equivalent 4 for plotting purposes)
          
          let parsedPh = parseFloat(latest.ph);
          if (isNaN(parsedPh)) {
            const str = (latest.ph || '').toLowerCase();
            if (str.includes('pink') || str.includes('red')) parsedPh = 4;
            else if (str.includes('blue') || str.includes('green')) parsedPh = 9;
            else parsedPh = 7; // neutral default
          }

          let parsedTurb = parseFloat(latest.turbidity);
          if (isNaN(parsedTurb)) {
            const tStr = (latest.turbidity || '').toLowerCase();
            parsedTurb = (tStr.includes('clear')) ? 1.0 : 8.0; 
          }

          let parsedColor = parseFloat(latest.color);
          if (isNaN(parsedColor)) {
            parsedColor = (latest.color.toLowerCase().includes('clear')) ? 2 : 12;
          }

          setUserParameters({
            ph: parsedPh,
            turbidity: parsedTurb,
            temperature: parseFloat(latest.temperature),
            color: parsedColor
          });
        } else {
          // Fallback static array if zero readings submitted
          setUserParameters(null);
        }
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
      }
    };
    if (user) fetchLatestReading();
  }, [user]);

  // Standard ideal parameters
  const idealParameters = { ph: 7.0, turbidity: 2.0, temperature: 20.0, color: 5 };
  
  // To avoid crashing before fetching returns
  const displayUserParams = userParameters || { ph: 0, turbidity: 0, temperature: 0, color: 0 };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Water Parameter Comparison', font: { size: 16 } },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const data = {
    labels: ['pH Level', 'Turbidity (NTU)', 'Temperature (°C)', 'Color (TCU)'],
    datasets: [
      {
        label: 'Ideal Parameters (Standard)',
        data: [idealParameters.ph, idealParameters.turbidity, idealParameters.temperature, idealParameters.color],
        backgroundColor: 'rgba(2, 132, 199, 0.8)', // Primary blue
        borderRadius: 4,
      },
      {
        label: userParameters ? 'Latest Given Parameters (User)' : 'No Data yet! Submit a reading.',
        data: [displayUserParams.ph, displayUserParams.turbidity, displayUserParams.temperature, displayUserParams.color],
        backgroundColor: 'rgba(245, 158, 11, 0.8)', // Warning Orange for visual contrast
        borderRadius: 4,
      }
    ],
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--bg-slate-900)' }}>Analytics & Comparison</h1>
        <p>Visually compare your inputted community water parameters against the global ideal standards.</p>
      </div>

      <div className="card" style={{ height: '450px', padding: '2rem' }}>
        <Bar options={options} data={data} />
      </div>

      <div className="grid-cols-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary-blue)' }}>How to read this graph</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            The <strong style={{ color: 'rgba(2, 132, 199, 1)' }}>blue bars</strong> represent the ideal, safe water standards according to health authorities. 
            The <strong style={{ color: 'rgba(245, 158, 11, 1)' }}>orange bars</strong> represent the most recent parameters reported by the community. 
            If the orange bar vastly exceeds the blue bar, the water quality is at risk.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Metrics Explained</h3>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>pH Level:</strong> Should ideally be between 6.5 and 8.5.</li>
            <li><strong>Turbidity:</strong> Cloudiness of water. Should be below 5 NTU.</li>
            <li><strong>Temperature:</strong> Extremely high temps allow bacterial growth.</li>
            <li><strong>Color:</strong> Highly colored water may indicate contamination.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
