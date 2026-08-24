import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { ProfileProvider } from './context/ProfileContext';
import { MealProvider } from './context/MealContext';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MessCoupon from './pages/MessCoupon';
import MessScanner from './pages/MessScanner';
import MessResult from './pages/MessResult';
import Messages from './pages/Messages';
import PlaceholderPage from './pages/PlaceholderPage';

import './styles/tokens.css';
import './styles/shell.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function App() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    function handleInstallRequest() {
      if (!installPrompt) {
        alert(
          'Install is not available yet. Open this website in Chrome and try again.'
        );

        return;
      }

      installPrompt.prompt();

      installPrompt.userChoice.then(({ outcome }) => {
        if (outcome === 'accepted') {
          setInstallPrompt(null);
        }
      });
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      'request-pwa-install',
      handleInstallRequest
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'request-pwa-install',
        handleInstallRequest
      );
    };
  }, [installPrompt]);

  return (
    <ProfileProvider>
      <MealProvider>
        <HashRouter>
          <div className="app-shell">
            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/edit-profile"
                element={<EditProfile />}
              />

              <Route
                path="/mess"
                element={<MessCoupon />}
              />

              <Route
                path="/mess/scanner"
                element={<MessScanner />}
              />

              <Route
                path="/mess/result"
                element={<MessResult />}
              />

              <Route
                path="/messages"
                element={<Messages />}
              />

              <Route
                path="/happenings"
                element={
                  <PlaceholderPage title="Happenings" />
                }
              />

              <Route
                path="/rms"
                element={
                  <PlaceholderPage title="RMS" />
                }
              />

              <Route
                path="/guest-room"
                element={
                  <PlaceholderPage title="Guest Room" />
                }
              />

              <Route
                path="*"
                element={
                  <PlaceholderPage
                    title="Not Found"
                    showNav={false}
                  />
                }
              />

            </Routes>
          </div>
        </HashRouter>
      </MealProvider>
    </ProfileProvider>
  );
}