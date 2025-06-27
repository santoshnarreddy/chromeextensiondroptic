import React, { useState, useEffect } from 'react';

const WaterReminder = ({ setError }) => {
  const [waterTarget, setWaterTarget] = useState(2000);
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    try {
      chrome.storage.local.get(['waterIntake', 'lastResetDate', 'waterTarget'], (result) => {
        if (chrome.runtime.lastError) return setError('Failed to load water intake data');
        const today = new Date().toDateString();
        if (!result.lastResetDate || result.lastResetDate !== today) {
          setWaterIntake(0);
          chrome.storage.local.set({ waterIntake: 0, lastResetDate: today });
        } else if (result?.waterIntake) {
          setWaterIntake(Number(result.waterIntake));
        }
        if (result?.waterTarget) setWaterTarget(Number(result.waterTarget));
      });
    } catch (err) {
      setError('Failed to access storage');
    }
  }, [setError]);

  const logWater = () => {
    try {
      const newIntake = Number(waterIntake) + 250;
      if (isNaN(newIntake)) {
        setError('Invalid water intake value');
        return;
      }
      setWaterIntake(newIntake);
      chrome.storage.local.set({ waterIntake: newIntake, lastResetDate: new Date().toDateString() });
    } catch (err) {
      setError('Failed to log water intake');
    }
  };

  const safeWaterTarget = Math.max(2000, waterTarget);
  const percent = Math.min(100, Math.round((waterIntake / safeWaterTarget) * 100));

  return (
    <div className="content">
      <div className="water-card">
        <div className="water-progress">{percent}%</div>
        <div className="water-label">Keep it Up! 💧</div>
        <div className="water-progress-bar">
          <div className="water-progress-bar-inner" style={{width: percent + '%'}}></div>
        </div>
        <div style={{color:'#333', fontSize:'1rem', marginBottom:8}}>{(waterIntake/1000).toFixed(1)} of {(safeWaterTarget/1000).toFixed(1)} L</div>
      </div>
      <input
        type="number"
        value={waterTarget}
        onChange={e => {
          const value = Math.max(0, Number(e.target.value) || 0);
          setWaterTarget(value);
          chrome.storage.local.set({ waterTarget: value });
        }}
        placeholder="Daily target (ml)"
        min="0"
      />
      <div className="water-log">
        <input type="number" value={waterIntake} readOnly />
        <button onClick={logWater}>+ 250ml</button>
      </div>
      <div>Progress: {waterIntake}/{safeWaterTarget}ml</div>
    </div>
  );
};

export default WaterReminder; 