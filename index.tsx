import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthKitProvider } from '@workos-inc/authkit-react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Determine if we are running locally to enable devMode (allows HTTP)
// On Netlify (HTTPS), devMode should be false.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthKitProvider 
      clientId="client_01KHKK1QPQ2WXYRBK2H4RF4S01"
      devMode={isLocal}
      redirectUri={window.location.origin}
    >
      <App />
    </AuthKitProvider>
  </React.StrictMode>
);