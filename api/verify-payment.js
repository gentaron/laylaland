const { createRemoteJWKSet, jwtVerify } = require('jose');

const PRIVY_APP_ID = 'cmnpp7f8p02zh0cjywonp6vgk';
const RECIPIENT_ADDRESS = '0x94Ac0Cbf9188E31979Ad1434d86Cdc75ddBEc10c';
const PAYMENT_AMOUNT = 9;

const CHAINS = {
  1: {
    usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    rpc: 'https://eth.llamarpc.com',
  },
  8453: {
    usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    rpc: 'https://mainnet.base.org',
  },
  56: {
    usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    rpc: 'https://bsc-dataseed.binance.org',
  },
  137: {
    usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    decimals: 6,
    rpc: 'https://polygon-rpc.com',
  },
};

// ERC20 Transfer event topic: keccak256("Transfer(address,address,uint256)")
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

async function rpcCall(rpcUrl, method, params) {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { tx, chain, address } = req.query;

  if (!tx || !chain || !address) {
    return res.status(400).json({ error: 'Missing parameters: tx, chain, address' });
  }

  const chainId = Number(chain);
  const chainConfig = CHAINS[chainId];
  if (!chainConfig) {
    return res.status(400).json({ error: 'Unsupported chain' });
  }

  try {
    const receipt = await rpcCall(chainConfig.rpc, 'eth_getTransactionReceipt', [tx]);

    if (!receipt) {
      return res.status(202).json({ error: 'Transaction not yet confirmed', verified: false });
    }

    if (receipt.status !== '0x1') {
      return res.status(400).json({ error: 'Transaction reverted', verified: false });
    }

    // Find the USDC Transfer log
    const transferLog = receipt.logs.find(log =>
      log.address.toLowerCase() === chainConfig.usdc.toLowerCase() &&
      log.topics[0] === TRANSFER_TOPIC
    );

    if (!transferLog) {
      return res.status(400).json({ error: 'No USDC transfer found in transaction', verified: false });
    }

    // Decode from/to from indexed topics (padded to 32 bytes)
    const from = '0x' + transferLog.topics[1].slice(26);
    const to = '0x' + transferLog.topics[2].slice(26);
    const amount = BigInt(transferLog.data);

    // Verify sender matches the authenticated wallet
    if (from.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ error: 'Sender does not match', verified: false });
    }

    // Verify recipient
    if (to.toLowerCase() !== RECIPIENT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ error: 'Wrong recipient', verified: false });
    }

    // Verify amount (>= 9 USDC)
    const expectedAmount = BigInt(PAYMENT_AMOUNT) * BigInt(10) ** BigInt(chainConfig.decimals);
    if (amount < expectedAmount) {
      return res.status(400).json({ error: 'Insufficient payment amount', verified: false });
    }

    return res.status(200).json({
      verified: true,
      from,
      to,
      amount: amount.toString(),
      chainId,
      txHash: tx,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Verification failed: ' + error.message, verified: false });
  }
};
