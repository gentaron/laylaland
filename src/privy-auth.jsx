import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';

const PRIVY_APP_ID = 'cmnpp7f8p02zh0cjywonp6vgk';

function AuthButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) {
    return React.createElement('div', { className: 'privy-loading' });
  }

  if (authenticated) {
    const address = user?.wallet?.address;
    const displayAddr = address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : 'Connected';

    return React.createElement('div', { className: 'privy-auth-info' },
      React.createElement('span', { className: 'privy-wallet-address' }, displayAddr),
      React.createElement('button', {
        onClick: logout,
        className: 'privy-btn privy-btn-disconnect'
      }, 'Disconnect')
    );
  }

  return React.createElement('button', {
    onClick: login,
    className: 'privy-btn privy-btn-connect'
  }, 'Connect Wallet');
}

function PaywallOverlay() {
  const { ready, authenticated, login } = usePrivy();

  if (!ready || authenticated) return null;

  return React.createElement('div', { className: 'paywall-overlay' },
    React.createElement('div', { className: 'paywall-content' },
      React.createElement('div', { className: 'paywall-icon' }, '\uD83D\uDD12'),
      React.createElement('h3', { className: 'paywall-title' }, 'Exclusive Content'),
      React.createElement('p', { className: 'paywall-desc' },
        'Connect your wallet to unlock illustrations and exclusive content.'
      ),
      React.createElement('button', {
        onClick: login,
        className: 'privy-btn privy-btn-unlock'
      }, 'Connect Wallet to Unlock')
    )
  );
}

function AuthStateManager() {
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (!ready) return;
    document.body.classList.toggle('privy-authenticated', authenticated);
    window.__privyAuthenticated = authenticated;
    window.dispatchEvent(new CustomEvent('privy-auth-state', {
      detail: { ready, authenticated, user }
    }));
  }, [ready, authenticated, user]);

  return null;
}

function App() {
  const paywallEl = document.getElementById('privy-paywall-root');

  return React.createElement(PrivyProvider, {
    appId: PRIVY_APP_ID,
    config: {
      loginMethods: ['wallet'],
      appearance: {
        theme: 'dark',
        accentColor: '#ff3d8a',
        landingHeader: 'Welcome to Layla Land',
        loginMessage: 'Connect your wallet to access exclusive content',
        walletList: ['metamask', 'detected_wallets', 'wallet_connect'],
        showWalletLoginFirst: true,
      },
    },
  },
    React.createElement(AuthStateManager, null),
    React.createElement(AuthButton, null),
    paywallEl
      ? createPortal(React.createElement(PaywallOverlay, null), paywallEl)
      : null
  );
}

// Mount
const root = document.getElementById('privy-auth-root');
if (root) {
  createRoot(root).render(React.createElement(App, null));
}
