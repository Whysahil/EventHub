import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../db';
import { generateToken } from '../utils/jwt';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/oauth-url', (req, res) => {
  const provider = req.query.provider as string;
  const host = req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;

  let authUrl = '';
  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'email profile',
      prompt: 'consent'
    });
    authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  } else if (provider === 'github') {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || '',
      redirect_uri: redirectUri,
      scope: 'user:email',
    });
    authUrl = `https://github.com/login/oauth/authorize?${params}`;
  } else {
    return res.status(400).json({ message: 'Invalid provider' });
  }

  res.json({ url: authUrl });
});

router.get('/callback/:provider', async (req, res, next) => {
  const { provider } = req.params;
  const { code } = req.query;

  try {
    let email = '';
    let name = '';
    const host = req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/api/auth/callback/${provider}`;
    
    if (!code) {
       return res.status(400).send('Authorization code missing');
    }

    if (provider === 'google') {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code: code as string,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok) throw new Error(tokenData.error_description || 'Failed to fetch Google token');

      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = await userResponse.json();
      email = userData.email;
      name = userData.name || 'Google User';
    } else if (provider === 'github') {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID || '',
          client_secret: process.env.GITHUB_CLIENT_SECRET || '',
          code,
          redirect_uri: redirectUri
        })
      });
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || tokenData.error) throw new Error(tokenData.error_description || 'Failed to fetch GitHub token');

      const userResponse = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = await userResponse.json();
      
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
      
      email = primaryEmail?.email;
      name = userData.name || userData.login || 'GitHub User';
    }

    if (!email) {
      throw new Error('Email not provided by OAuth provider');
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const generatedPassword = await bcrypt.hash(Math.random().toString(), 10);
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: generatedPassword
        }
      });
    }

    const token = generateToken(user.id, user.role);

    res.send(`
      <html>
        <body style="background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'OAUTH_AUTH_SUCCESS', 
                payload: { 
                   user: ${JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })}, 
                   token: '${token}' 
                } 
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <div style="text-align: center;">
            <h2 style="color: #4ade80;">Authentication successful</h2>
            <p style="color: #94a3b8;">This window should close automatically.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('OAuth Error:', error);
    res.send(`
      <html>
        <body style="background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
          <div style="text-align: center;">
            <h2 style="color: #ef4444;">Authentication failed</h2>
            <p style="color: #94a3b8;">${error.message || 'An error occurred during authentication.'}</p>
            <button onclick="window.close()" style="margin-top: 1rem; padding: 0.5rem 1rem; border-radius: 0.375rem; background: #3b82f6; color: white; border: none; cursor: pointer;">Close Window</button>
          </div>
        </body>
      </html>
    `);
  }
});

export default router;
