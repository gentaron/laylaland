import React, { useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';

const PRIVY_APP_ID = 'cmnpp7f8p02zh0cjywonp6vgk';
const PAYMENT_AMOUNT = 9; // 9 USDC

const RECIPIENT_ADDRESS = '0x94Ac0Cbf9188E31979Ad1434d86Cdc75ddBEc10c';

const CHAINS = {
  1: {
    name: 'Ethereum',
    icon: '\u039E',
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    hexId: '0x1',
  },
  8453: {
    name: 'Base',
    icon: '\uD83D\uDD35',
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    hexId: '0x2105',
    addParams: {
      chainId: '0x2105',
      chainName: 'Base',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: ['https://basescan.org'],
    },
  },
  56: {
    name: 'BNB Chain',
    icon: '\uD83D\uDFE1',
    usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    hexId: '0x38',
    addParams: {
      chainId: '0x38',
      chainName: 'BNB Smart Chain',
      nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
      rpcUrls: ['https://bsc-dataseed.binance.org'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
  },
  137: {
    name: 'Polygon',
    icon: '\uD83D\uDFE3',
    usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    decimals: 6,
    hexId: '0x89',
    addParams: {
      chainId: '0x89',
      chainName: 'Polygon',
      nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: ['https://polygonscan.com'],
    },
  },
};

// ── Helpers ──────────────────────────────────────────────────

function encodeTransfer(to, amount) {
  const sig = 'a9059cbb';
  const addr = to.slice(2).toLowerCase().padStart(64, '0');
  const amt = amount.toString(16).padStart(64, '0');
  return '0x' + sig + addr + amt;
}

function getPaymentProof(walletAddress) {
  try {
    const key = 'laylaland_paid_' + walletAddress.toLowerCase();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

function storePaymentProof(walletAddress, txHash, chainId) {
  const key = 'laylaland_paid_' + walletAddress.toLowerCase();
  localStorage.setItem(key, JSON.stringify({ txHash, chainId, ts: Date.now() }));
}

async function switchChain(provider, chain) {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.hexId }],
    });
  } catch (err) {
    if (err.code === 4902 && chain.addParams) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [chain.addParams],
      });
    } else {
      throw err;
    }
  }
}

async function waitForReceipt(provider, txHash) {
  for (let i = 0; i < 60; i++) {
    const receipt = await provider.request({
      method: 'eth_getTransactionReceipt',
      params: [txHash],
    });
    if (receipt && receipt.status) {
      if (receipt.status === '0x1') return receipt;
      throw new Error('Transaction reverted');
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Transaction not confirmed after 2 minutes');
}

// ── Auth Button (Nav) ────────────────────────────────────────

function AuthButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();

  if (!ready) return React.createElement('div', { className: 'privy-loading' });

  if (authenticated) {
    const address = user?.wallet?.address;
    const short = address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connected';
    return React.createElement('div', { className: 'privy-auth-info' },
      React.createElement('span', { className: 'privy-wallet-address' }, short),
      React.createElement('button', { onClick: logout, className: 'privy-btn privy-btn-disconnect' }, 'Disconnect')
    );
  }

  return React.createElement('button', { onClick: login, className: 'privy-btn privy-btn-connect' }, 'Connect Wallet');
}

// ── Auth State Manager ───────────────────────────────────────

function AuthStateManager({ onPaidChange }) {
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    if (!ready) return;
    document.body.classList.toggle('privy-authenticated', authenticated);
    window.__privyAuthenticated = authenticated;

    if (authenticated && user?.wallet?.address) {
      const proof = getPaymentProof(user.wallet.address);
      if (proof) {
        document.body.classList.add('privy-paid');
        window.__privyPaid = true;
        onPaidChange(true);
      } else {
        document.body.classList.remove('privy-paid');
        window.__privyPaid = false;
        onPaidChange(false);
      }
    } else {
      document.body.classList.remove('privy-paid');
      window.__privyPaid = false;
      onPaidChange(false);
    }
  }, [ready, authenticated, user]);

  return null;
}

// ── Paywall Gate ─────────────────────────────────────────────

function PaywallGate({ paid, onPaid }) {
  const { ready, authenticated, login, user } = usePrivy();
  const { wallets } = useWallets();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // State 1: Loading
  if (!ready) return null;

  // State 2: Not connected → show connect prompt
  if (!authenticated) {
    return React.createElement('div', { className: 'paywall-overlay' },
      React.createElement('div', { className: 'paywall-content' },
        React.createElement('div', { className: 'paywall-icon' }, '\uD83D\uDD12'),
        React.createElement('h3', { className: 'paywall-title' }, 'Exclusive Content'),
        React.createElement('p', { className: 'paywall-desc' },
          'Connect your wallet and pay 9 USDC to unlock illustrations and exclusive content.'
        ),
        React.createElement('button', {
          onClick: login,
          className: 'privy-btn privy-btn-unlock',
        }, 'Connect Wallet')
      )
    );
  }

  // State 3: Paid → hide overlay
  if (paid) return null;

  // State 4: Connected but not paid → show payment UI
  const handlePay = async (chainId) => {
    setError(null);
    const chain = CHAINS[chainId];
    const wallet = wallets[0];
    if (!wallet) { setError('No wallet found'); return; }

    try {
      const provider = await wallet.getEthereumProvider();

      // Switch chain
      setStatus('switching');
      await switchChain(provider, chain);

      // Build and send USDC transfer
      setStatus('confirming');
      const amount = BigInt(PAYMENT_AMOUNT) * BigInt(10) ** BigInt(chain.decimals);
      const data = encodeTransfer(RECIPIENT_ADDRESS, amount);
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: wallet.address,
          to: chain.usdc,
          data: data,
        }],
      });

      // Wait for confirmation
      setStatus('waiting');
      await waitForReceipt(provider, txHash);

      // Store proof
      storePaymentProof(wallet.address, txHash, chainId);
      document.body.classList.add('privy-paid');
      window.__privyPaid = true;
      setStatus('done');
      onPaid();
    } catch (err) {
      console.error('Payment error:', err);
      if (err.code === 4001) {
        setError('Transaction rejected by user');
      } else {
        setError(err.message || 'Payment failed. Please try again.');
      }
      setStatus('idle');
    }
  };

  const statusMessages = {
    idle: null,
    switching: 'Switching network...',
    confirming: 'Please confirm the transaction in your wallet...',
    waiting: 'Waiting for confirmation...',
    done: 'Payment confirmed!',
  };

  const isProcessing = status !== 'idle' && status !== 'done';

  return React.createElement('div', { className: 'paywall-overlay' },
    React.createElement('div', { className: 'paywall-content paywall-payment' },
      React.createElement('div', { className: 'paywall-icon' }, '\uD83D\uDCB3'),
      React.createElement('h3', { className: 'paywall-title' }, 'Unlock Content'),
      React.createElement('p', { className: 'paywall-desc' },
        'Pay 9 USDC to access exclusive illustrations and content.'
      ),
      React.createElement('div', { className: 'paywall-price' }, '9 USDC'),
      React.createElement('p', { className: 'paywall-chain-label' }, 'Select network to pay:'),
      React.createElement('div', { className: 'chain-grid' },
        Object.entries(CHAINS).map(([id, chain]) =>
          React.createElement('button', {
            key: id,
            className: 'chain-btn' + (isProcessing ? ' disabled' : ''),
            onClick: () => !isProcessing && handlePay(Number(id)),
            disabled: isProcessing,
          },
            React.createElement('span', { className: 'chain-icon' }, chain.icon),
            React.createElement('span', { className: 'chain-name' }, chain.name)
          )
        )
      ),
      statusMessages[status] && React.createElement('div', { className: 'payment-status' },
        React.createElement('span', { className: 'payment-spinner' }),
        ' ', statusMessages[status]
      ),
      error && React.createElement('div', { className: 'payment-error' }, error)
    )
  );
}

// ── App Root ─────────────────────────────────────────────────

function App() {
  const paywallEl = document.getElementById('privy-paywall-root');
  const [paid, setPaid] = useState(false);

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
    React.createElement(AuthStateManager, { onPaidChange: setPaid }),
    React.createElement(AuthButton, null),
    paywallEl
      ? createPortal(
          React.createElement(PaywallGate, { paid, onPaid: () => setPaid(true) }),
          paywallEl
        )
      : null
  );
}

// ── Mount ────────────────────────────────────────────────────

const rootEl = document.getElementById('privy-auth-root');
if (rootEl) {
  createRoot(rootEl).render(React.createElement(App, null));
}
