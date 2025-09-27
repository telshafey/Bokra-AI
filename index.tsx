import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// FIX: Corrected import to point to a local module.
import App from './App';
import { AssetsProvider } from './components/contexts/AssetsContext';
import { PoliciesProvider } from './components/contexts/PoliciesContext';
import { CompanyStructureProvider } from './components/contexts/CompanyStructureContext';
import { UserProvider } from './components/contexts/UserContext';
// FIX: Corrected import to point to a local module.
import { RequestProvider } from './components/contexts/RequestContext';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { HelpCenterProvider } from './components/contexts/HelpCenterContext';
import { ToastProvider } from './components/contexts/ToastContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ToastProvider>
          <HelpCenterProvider>
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
          </HelpCenterProvider>
        </ToastProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
