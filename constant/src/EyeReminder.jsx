import React, { useState, useEffect } from 'react';
import ImageSlider from './ImageSlider';

const EyeReminder = ({ setError }) => {
const [eyeInterval, setEyeInterval] = useState(20);

  useEffect(() => {
    try {
      chrome.storage.local.get(['eyeInterval'], (result) => {
        if (chrome.runtime.lastError) return setError('Failed to load settings');
        if (result?.eyeInterval) setEyeInterval(Number(result.eyeInterval));
      });
    } catch (err) {
      setError('Failed to access storage');
    }
  }, [setError]);

  const setEyeReminder = () => {
    try {
      const interval = Number(eyeInterval);
      if (isNaN(interval) || interval < 1) {
        setError('Please enter a valid interval (minimum 1 minute)');
        return;
      }
      chrome.storage.local.set({ eyeInterval: interval }, () => {
        if (chrome.runtime.lastError) return setError('Failed to save eye interval');
        chrome.alarms.create('eyeReminder', {
          periodInMinutes: interval
        }, () => {
          if (chrome.runtime.lastError) return setError('Failed to set eye reminder');
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Eye Reminder Set',
            message: `Reminder set for every ${interval} minutes`
          }, () => {
            if (chrome.runtime.lastError) setError('Failed to show notification');
          });
        });
      });
    } catch (err) {
      setError('Failed to set reminder');
    }
  };

  return (
    <div className="content">
      <ImageSlider />
      <h3>Eye Reminder</h3>
      <input
        type="number"
        value={eyeInterval}
        onChange={e => setEyeInterval(Math.max(1, Number(e.target.value) || 1))}
        placeholder="Interval in minutes"
        min="1"
      />
      <button onClick={setEyeReminder}>Set Reminder</button>
    </div>
  );
};

export default EyeReminder; 