
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AssetsProvider } from './components/contexts/AssetsContext';
import { PoliciesProvider } from './components/contexts/PoliciesContext';
import { CompanyStructureProvider } from './components/contexts/CompanyStructureContext';
import { UserProvider } from './components/contexts/UserContext';
import { RequestProvider } from './components/contexts/RequestContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PoliciesProvider>
      <AssetsProvider>
        <CompanyStructureProvider>
          <UserProvider>
            <RequestProvider>
              <App />
            </RequestProvider>
          </UserProvider>
        </CompanyStructureProvider>
      </AssetsProvider>
    </PoliciesProvider>
  </React.StrictMode>
);