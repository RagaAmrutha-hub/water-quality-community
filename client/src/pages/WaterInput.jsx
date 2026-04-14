import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, FlaskConical, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WaterInput() {
  const [formData, setFormData] = useState({ color: '', temperature: '', taste: '', ph: '', turbidity: '' });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Has token

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const checkSafety = () => {
    const temp = parseFloat(formData.temperature);
    
    // Evaluate pH (Number or Color)
    let phSafe = false;
    const phVal = parseFloat(formData.ph);
    const phStr = formData.ph.toLowerCase().trim();
    
    if (!isNaN(phVal)) {
      phSafe = (phVal >= 6.5 && phVal <= 8.5);
    } else {
      // Color-based logic (Pink/Red = Highly Acidic [Fail], Purple/Green/Blue/Yellow(Turmeric) = Neutral/Basic [Pass])
      if (phStr.includes('pink') || phStr.includes('red')) {
        phSafe = false;
      } else {
        phSafe = true; // Assuming normal colors default to safe for simple logic
      }
    }

    // Evaluate Turbidity (Number or Visual Clarity)
    let turbSafe = false;
    const turbVal = parseFloat(formData.turbidity);
    const turbStr = formData.turbidity.toLowerCase().trim();
    
    if (!isNaN(turbVal)) {
      turbSafe = (turbVal <= 5);
    } else {
      // Visual inspection logic
      if (turbStr.includes('cloudy') || turbStr.includes('muddy') || turbStr.includes('particle') || turbStr.includes('brown')) {
        turbSafe = false;
      } else {
        turbSafe = true; // 'Clear' or other words
      }
    }
    
    // Final Evaluation
    const isSafe = phSafe && turbSafe && (temp <= 35) && (formData.taste.toLowerCase() === 'normal');
    // Note: Color appearance field acts as qualitative extra data
    return isSafe ? 'SAFE' : 'UNSAFE';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const statusResult = checkSafety();
    setResult(statusResult);

    try {
      // Send fully evaluated string data into MySQL backend
      await axios.post('/api/water', { ...formData, result: statusResult }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      // Let the user admire the Evaluation Box instead of abruptly redirecting!
      // You can also clear the form fields here if you'd prefer:
      // setFormData({ color: '', temperature: '', taste: '', ph: '', turbidity: '' });
      
    } catch (err) {
      console.error(err);
      alert('Failed to save to database: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--bg-slate-900)' }}>Log Water Parameters</h1>
        <p>Enter the observed metrics to get an instant safety evaluation. Learn how to test your water below!</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* LEFT COLUMN - FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Parameter Inputs</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Color (Describe Appearance)</label>
                <input type="text" name="color" className="form-input" required placeholder="e.g. Clear, faint yellow, muddy" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Temperature (°C)</label>
                <input type="number" name="temperature" step="0.1" className="form-input" required onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">pH Level (Number or Test Color)</label>
                <input type="text" name="ph" className="form-input" required placeholder="e.g. 7.2 or 'Purple'" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Turbidity (NTU or Clarity)</label>
                <input type="text" name="turbidity" className="form-input" required placeholder="e.g. 2.5 or 'Clear'" onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Taste</label>
                <select name="taste" className="form-input" required onChange={handleChange} defaultValue="">
                  <option value="" disabled>Select Taste</option>
                  <option value="Normal">Normal (Tasteless)</option>
                  <option value="Metallic">Metallic</option>
                  <option value="Salty">Salty</option>
                  <option value="Bitter">Bitter</option>
                  <option value="Bleaching">Bleaching / Chlorine</option>
                  <option value="Hard">Hard</option>
                  <option value="Earthy">Earthy</option>
                  <option value="Sweet">Sweet</option>
                  <option value="Strong">Strong Taste</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Evaluate Safety</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN - ALERTS & GUIDES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Output Card */}
          <div className="card" style={{ textAlign: 'center', borderColor: result === 'SAFE' ? 'var(--success)' : result === 'UNSAFE' ? 'var(--danger)' : 'var(--border)' }}>
            {result ? (
              <>
                <div style={{ marginBottom: '0.5rem', color: result === 'SAFE' ? 'var(--success)' : 'var(--danger)' }}>
                  {result === 'SAFE' ? <ShieldCheck size={48} style={{ margin: '0 auto' }} /> : <ShieldAlert size={48} style={{ margin: '0 auto' }} />}
                </div>
                <h2 style={{ color: result === 'SAFE' ? 'var(--success)' : 'var(--danger)' }}>Water is {result}</h2>
                <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                  {result === 'SAFE' 
                    ? "Safely consumable based on provided metrics."
                    : "Caution: Metrics deviate from ideal standards."}
                </p>
              </>
            ) : (
              <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>Submit parameters to evaluate safety instantly.</p>
            )}
          </div>

          {/* DIY Methods Card */}
          <div className="card" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FlaskConical size={20} /> How to Test at Home
            </h3>

            {/* pH Methods */}
            <h4 style={{ color: 'var(--bg-slate-900)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Measuring pH Value</h4>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Method 1: pH Test Strips</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Dip a pH test strip into a clean water sample for a few seconds. Wait for the color to develop and compare it to the chart provided with the kit.</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Method 2: Red Cabbage Indicator</strong>
              <ol style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
                <li>Chop a quarter of a red cabbage, place in a bowl, and cover with boiling water.</li>
                <li>Let sit for 10–30 mins until water turns deep purple. Strain and cool.</li>
                <li>Pour test water in a glass, add the purple juice.</li>
                <li><strong>Pink/Red:</strong> Acidic (pH {'<'} 7) | <strong>Purple:</strong> Neutral (pH ~ 7) | <strong>Blue/Green:</strong> Alkaline (pH {'>'} 7).</li>
              </ol>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <strong>Method 3: Kitchen Indicators</strong>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
                <li><strong>Turmeric:</strong> Stays yellow in neutral/acidic water. Turns red if highly alkaline.</li>
                <li><strong>Baking Soda:</strong> Add a spoonful to water. If it fizzes, water is acidic. No reaction usually means neutral or alkaline.</li>
              </ul>
            </div>

            {/* Turbidity Methods */}
            <h4 style={{ color: 'var(--bg-slate-900)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} /> Measuring Turbidity (Clarity)
            </h4>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Method 1: Digital Turbidity Meter</strong>
              <ol style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', paddingLeft: '1.2rem', lineHeight: '1.5' }}>
                <li>Collect sample in vial, wipe to remove smudges.</li>
                <li>Insert vial into meter aligning the markings.</li>
                <li>Close lid and read result in NTU.</li>
              </ol>
            </div>

            <div>
              <strong>Method 2: Visual Inspection</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Pour water into a clean, clear glass. Hold it up to a light source against a black background. Look for floating particles or cloudiness (does not give NTU value).</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
