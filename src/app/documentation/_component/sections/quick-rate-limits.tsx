import { ApiCodeBlock } from "../code-block";

export function QuickRateLimits() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-4">Rate Limits</h1>
        <p className="text-gray-600 text-lg">Learn about the rate limits for TheNews API and how to handle them.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Overview</h2>
        <p className="text-gray-600">
          To ensure fair usage and maintain service stability, TheNews API implements rate limiting. Rate limits are
          applied on a per-API key basis.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Rate Limit Tiers</h2>
        <p className="text-gray-600 mb-4">Rate limits vary based on your subscription plan:</p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead> 
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Plan</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Requests per Minute</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Requests per Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-sm text-gray-600">Free</td>
                <td className="py-2 px-4 text-sm text-gray-600">60</td>
                <td className="py-2 px-4 text-sm text-gray-600">10,000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-gray-600">Basic</td>
                <td className="py-2 px-4 text-sm text-gray-600">300</td>
                <td className="py-2 px-4 text-sm text-gray-600">50,000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-gray-600">Pro</td>
                <td className="py-2 px-4 text-sm text-gray-600">1,000</td>
                <td className="py-2 px-4 text-sm text-gray-600">200,000</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-gray-600">Enterprise</td>
                <td className="py-2 px-4 text-sm text-gray-600">Custom</td>
                <td className="py-2 px-4 text-sm text-gray-600">Custom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Rate Limit Headers</h2>
        <p className="text-gray-600">
          Each API response includes headers that provide information about your current rate limit status:
        </p>
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
          <code className="block text-sm text-gray-600">
            <span className="text-amber-600">X-RateLimit-Limit</span>: 60
            <br />
            <span className="text-amber-600">X-RateLimit-Remaining</span>: 59
            <br />
            <span className="text-amber-600">X-RateLimit-Reset</span>: 1620000000
          </code>
        </div>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>
            <span className="text-amber-600">X-RateLimit-Limit</span>: The maximum number of requests you can make per
            minute
          </li>
          <li>
            <span className="text-amber-600">X-RateLimit-Remaining</span>: The number of requests remaining in the
            current rate limit window
          </li>
          <li>
            <span className="text-amber-600">X-RateLimit-Reset</span>: The time at which the current rate limit window
            resets in Unix time
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Rate Limit Exceeded</h2>
        <p className="text-gray-600">If you exceed your rate limit, you&apos;ll receive a 429 Too Many Requests response:</p>
        <ApiCodeBlock
          language="json"
          code={`{
  "success": false,
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded. Please try again later",
    "status": 429,
    "retry_after": 30
  }
}`}
        />
        <p className="text-gray-600">
          The <span className="text-amber-600">retry_after</span> field indicates the number of seconds to wait before
          making another request.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Best Practices</h2>
        <p className="text-gray-600">Here are some best practices for working with rate limits:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>Monitor the rate limit headers in API responses</li>
          <li>Implement exponential backoff for retries</li>
          <li>Cache responses when possible to reduce the number of API calls</li>
          <li>Batch requests when possible</li>
          <li>Upgrade your plan if you consistently hit rate limits</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Example: Handling Rate Limits</h2>
        <p className="text-gray-600">Here&apos;s an example of how to handle rate limits in your code:</p>
        <ApiCodeBlock
          language="javascript"
          code={`async function makeApiRequest(url, options, retries = 3) {
  try {
    const response = await fetch(url, options);
    
    // Check if rate limited
    if (response.status === 429) {
      const data = await response.json();
      const retryAfter = data.error.retry_after || 60; // Default to 60 seconds
      
      console.log(\`Rate limited. Retrying after \${retryAfter} seconds\`);
      
      if (retries > 0) {
        // Wait for the specified time
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        
        // Retry the request with one less retry
        return makeApiRequest(url, options, retries - 1);
      } else {
        throw new Error('Maximum retries reached');
      }
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Example usage
makeApiRequest('https://api.thenews.africca/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${API_KEY}\`
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    name: 'John Doe'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
        />
      </div>
    </div>
  )
}
