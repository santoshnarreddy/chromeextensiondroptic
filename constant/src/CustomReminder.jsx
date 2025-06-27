import React, { useState } from 'react';
import ImageSlider from './ImageSlider';

const CustomReminder = ({ setError }) => {
  const [customTime, setCustomTime] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const handleInputChange = setter => e => {
    setter(e.target.value);
    setError('');
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const setCustomReminder = () => {
    try {
      if (!customTime || !customMessage) {
        setError('Please fill in required fields');
        return;
      }
      const [hours, minutes] = customTime.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        setError('Invalid time format');
        return;
      }
      if (customUrl && !isValidUrl(customUrl)) {
        setError('Invalid URL format');
        return;
      }
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0);
      if (reminderTime < now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }
      const delayInMinutes = (reminderTime - now) / 1000 / 60;
      chrome.alarms.create('customReminder', {
        delayInMinutes: delayInMinutes
      }, () => {
        if (chrome.runtime.lastError) {
          setError('Failed to set custom reminder');
          return;
        }
        chrome.storage.local.set({
          customReminder: {
            message: customMessage,
            url: customUrl
          }
        }, () => {
          if (chrome.runtime.lastError) {
            setError('Failed to save reminder details');
            return;
          }
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Reminder Set',
            message: `Reminder set for ${customTime}`
          }, () => {
            if (chrome.runtime.lastError) {
              setError('Failed to show notification');
            }
          });
        });
      });
    } catch (err) {
      setError('Failed to set custom reminder');
    }
  };

  return (
    <div className="content">
      <ImageSlider />
      <h3>Custom Reminder</h3>
      <input
        type="time"
        value={customTime}
        onChange={handleInputChange(setCustomTime)}
        required
      />
      <input
        type="text"
        value={customMessage}
        onChange={handleInputChange(setCustomMessage)}
        placeholder="Reminder message"
        required
      />
      <input
        type="url"
        value={customUrl}
        onChange={handleInputChange(setCustomUrl)}
        placeholder="URL (optional)"
      />
      <button onClick={setCustomReminder}>Set Reminder</button>
    </div>
  );
};

export default CustomReminder; 