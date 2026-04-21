import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthScreen } from './AuthScreen';
import { FortsListScreen } from './FortsScreen';
import { FortDetailScreen } from './FortDetail';
import { AddFortScreen } from './AddFortScreen';
import './App.css';

const AppContent = () => {
  const { token } = useAuth();
  const [screen, setScreen] = useState('list'); // list, detail, add
  const [selectedFortId, setSelectedFortId] = useState(null);

  if (!token) {
    return <AuthScreen />;
  }

  const handleSelectFort = (fort) => {
    setSelectedFortId(fort._id);
    setScreen('detail');
  };

  const handleBack = () => {
    setScreen('list');
    setSelectedFortId(null);
  };

  const handleFortAdded = () => {
    setScreen('list');
  };

  return (
    <>
      {screen === 'list' && (
        <div className="app-with-fab">
          <FortsListScreen 
            onSelectFort={handleSelectFort} 
            onBack={handleBack}
          />
          <button 
            className="fab-button"
            onClick={() => setScreen('add')}
            title="Add new fort"
          >
            +
          </button>
        </div>
      )}
      {screen === 'detail' && selectedFortId && (
        <FortDetailScreen 
          fortId={selectedFortId}
          onBack={handleBack}
          onUpdate={handleFortAdded}
        />
      )}
      {screen === 'add' && (
        <AddFortScreen 
          onBack={handleBack}
          onFortAdded={handleFortAdded}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
