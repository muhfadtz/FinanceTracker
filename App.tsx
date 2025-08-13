import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import MainApp from './screens/MainApp';
import { FullPageSpinner } from './components/Spinner';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SignUp from './screens/SignUp';

type AuthView = 'welcome' | 'login' | 'signup';

const AuthFlow = () => {
    const [view, setView] = useState<AuthView>('welcome');
    const { signInWithGoogle } = useAuth();
    
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Google Sign-In failed", error);
        }
    }
    
    switch (view) {
        case 'login':
            return <Login onNavigate={setView} />;
        case 'signup':
            return <SignUp onNavigate={setView} />;
        case 'welcome':
        default:
            return <Welcome onNavigate={setView} onGoogleSignIn={handleGoogleSignIn}/>;
    }
}

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageSpinner />;
  }

  return user ? (
    <DataProvider>
      <MainApp />
    </DataProvider>
  ) : <AuthFlow />;
};

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
          <ThemedApp />
      </SettingsProvider>
    </AuthProvider>
  );
};

const ThemedApp = () => {
    const { theme } = useSettings();
    return (
         <div className={`w-full min-h-screen font-sans ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}`}>
            <div className={`max-w-md mx-auto shadow-2xl min-h-screen relative flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <AppContent />
            </div>
        </div>
    )
}

export default App;