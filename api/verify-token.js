const { createRemoteJWKSet, jwtVerify } = require('jose');

const PRIVY_APP_ID = 'cmnpp7f8p02zh0cjywonp6vgk';
const JWKS_URL = `https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`;

let jwks;
function getJWKS() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(JWKS_URL));
  }
  return jwks;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: 'privy.io',
      audience: PRIVY_APP_ID,
    });

    return res.status(200).json({
      verified: true,
      sub: payload.sub,
      iss: payload.iss,
      aud: payload.aud,
      exp: payload.exp,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
