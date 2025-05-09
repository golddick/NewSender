import { CodeTabs } from "../code-tabs"

export function QuickAuthentication() {
  const javascriptCode = `// Authentication with API Key
const apiKey = 'your_api_key_here';

fetch('https://api.thenews.sixthgrid.com/v1/api/subscribers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    name: 'John Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`

  const typescriptCode = `// Authentication with API Key
const apiKey: string = 'your_api_key_here';

interface SubscribeRequest {
  email: string;
  name: string;
}

const subscribeData: SubscribeRequest = {
  email: 'subscriber@example.com',
  name: 'John Doe'
};

fetch('https://api.thenews.sixthgrid.com/v1/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify(subscribeData)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`

  const curlCode = `curl -X POST https://api.thenews.sixthgrid.com/v1/api/subscribe \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -d '{
    "email": "subscriber@example.com",
    "name": "John Doe"
  }'`

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">Authentication</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          The TheNews API uses API keys to authenticate requests. You can view and manage your API keys in the TheNews
          Dashboard.
        </p>

        <p>
          Your API keys carry many privileges, so be sure to keep them secure! Do not share your API keys in publicly
          accessible areas such as GitHub, client-side code, etc.
        </p>

        <h2>Authentication Methods</h2>
        <p>
          Authentication to the API is performed via HTTP Bearer Auth. Provide your API key as the bearer token value.
        </p>

        <h3>HTTP Bearer Auth</h3>
        <p>All API requests must include your API key in the Authorization header:</p>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>Authorization: Bearer your_api_key_here</code>
        </pre>

        <h2>API Key Security</h2>
        <ul>
          <li>Never expose your API key in client-side JavaScript</li>
          <li>Use environment variables to store your API key in your applications</li>
          <li>For browser-based applications, make API calls from your server, not directly from the browser</li>
          <li>Implement proper CORS policies on your server</li>
          <li>Rotate your API keys periodically</li>
        </ul>

        <h2>Authentication Example</h2>
      </div>

      <CodeTabs
        javascript={javascriptCode}
        typescript={typescriptCode}
        curl={curlCode}
        title="Authentication Example"
      />
    </div>
  )
}
