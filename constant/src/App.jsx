import { useState } from 'react';
import './styles.css';
import EyeReminder from './EyeReminder';
import WaterReminder from './WaterReminder';
import CustomReminder from './CustomReminder';

const App = () => {
    const [activeTab, setActiveTab] = useState('eye');
    const [error, setError] = useState('');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'eye':
                return <EyeReminder setError={setError} />;
            case 'water':
                return <WaterReminder setError={setError} />;
            case 'custom':
                return <CustomReminder setError={setError} />;
            default:
                return <div className="content">Invalid tab selected</div>;
        }
    };

    return (
        <div className="container">
            <div className="tabs">
                <div className={`tab ${activeTab === 'eye' ? 'active' : ''}`} onClick={() => setActiveTab('eye')}>Eye Reminder</div>
                <div className={`tab ${activeTab === 'water' ? 'active' : ''}`} onClick={() => setActiveTab('water')}>Water Intake</div>
                <div className={`tab ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Custom Reminder</div>
            </div>
            {error && <div className="error">{error}</div>}
            {renderTabContent()}
        </div>
    );
};

export default App; 