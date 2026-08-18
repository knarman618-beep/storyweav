# StorySpark API Proxy Server

This is a simple proxy server that securely serves the OpenRouter API key to the StorySpark application.

## Deployment to Render.com

### Prerequisites
- Render.com account
- OpenRouter API key

### Deployment Steps

1. **Create a new Web Service on Render.com:**
   - Go to https://dashboard.render.com
   - Click "New +" ? "Web Service"
   - Connect your Git repository (or create one with this code)
   - Select the branch to deploy from

2. **Configure Environment Variables:**
   - In Render dashboard, go to "Environment" tab
   - Add the following environment variable:
     ```
     OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxx
     ```
   - Replace with your actual OpenRouter API key

3. **Configure Build & Start Commands:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Select Plan:**
   - Free tier is sufficient for this simple proxy
   - Choose appropriate resources if using paid tier

5. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically deploy your service

### Using the Proxy in StorySpark

Once deployed, use the proxy URL in your C# code:
```csharp
private const string ProxyUrl = "https://your-service-name.onrender.com/api/key";
```

## API Endpoints

### GET /health
Health check endpoint
```bash
curl https://your-service-name.onrender.com/health
```

### GET /api/key
Returns the OpenRouter API key
```bash
curl https://your-service-name.onrender.com/api/key
```

Response:
```json
{
  "key": "sk-or-v1-xxxxxxxxxxxxxx",
  "provider": "openrouter",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/version
Version information
```bash
curl https://your-service-name.onrender.com/api/version
```

## Security Recommendations

1. **Add Authentication Token:**
   - Modify server.js to require an auth token header
   - Pass token from C# app with each request

2. **Rate Limiting:**
   - Add express-rate-limit to prevent abuse

3. **HTTPS Only:**
   - Render.com provides free SSL/TLS certificates

4. **IP Whitelisting:**
   - Consider restricting to known application domains

Example with authentication:

```javascript
app.get('/api/key', (req, res) => {
  const token = req.headers['x-api-token'];
  if (token !== process.env.PROXY_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // ... return key
});
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key | `sk-or-v1-...` |
| `PORT` | Server port (optional) | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `PROXY_TOKEN` | Optional auth token | `your-secure-token` |

## Updating the API Key

To update the API key:
1. Go to Render dashboard
2. Navigate to your Web Service
3. Go to "Environment" tab
4. Update the `OPENROUTER_API_KEY` value
5. Click "Save" - the service will automatically redeploy
6. No need to resubmit to Microsoft Store!

## Troubleshooting

**Service won't deploy:**
- Check Build logs in Render dashboard
- Verify package.json and server.js are in root directory

**API key endpoint returns 500:**
- Check Environment variables are set correctly
- View Live logs in Render dashboard

**CORS errors:**
- Verify CORS is enabled in server.js
- Check the origin is allowed in corsOptions

## Cost

- Render.com free tier includes:
  - 750 hours/month of web service runtime
  - Sufficient for a lightweight proxy

---

For questions about Render.com hosting, visit: https://render.com/docs
