import { ApiCodeBlock } from "../code-block";


export function QuickBestPractices() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-4 font-heading">Best Practices</h1>
        <p className="text-muted-foreground text-lg">Learn how to use TheNews API effectively and efficiently.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black font-heading">Authentication</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Always use Bearer token authentication for production applications</li>
          <li>Store your API key securely and never expose it in client-side code</li>
          <li>Use environment variables to store your API key</li>
          <li>Rotate your API key regularly</li>
          <li>Use different API keys for development and production</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black font-heading">Rate Limiting</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Monitor the rate limit headers in API responses</li>
          <li>Implement exponential backoff for retries</li>
          <li>Cache responses when possible to reduce the number of API calls</li>
          <li>Batch requests when possible</li>
          <li>Upgrade your plan if you consistently hit rate limits</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black font-heading">Error Handling</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Always check the <code className="text-gold-400">success</code> field in API responses
          </li>
          <li>Handle specific error codes appropriately</li>
          <li>Implement proper logging for API errors</li>
          <li>Display user-friendly error messages to your users</li>
          <li>Implement retry logic for transient errors</li>
        </ul>
        <p className="text-muted-foreground mt-4">Here&apos;s an example of good error handling:</p>
        <ApiCodeBlock
          language="javascript"
          code={`function handleApiError(error) {
  // Log the error for debugging
  console.error('API Error:', error);
  
  // Handle specific error codes
  switch (error.code) {
    case 'invalid_email':
      return 'Please provide a valid email address';
    case 'newsletter_not_found':
      return 'The newsletter category does not exist';
    case 'subscriber_exists':
      return 'This email is already subscribed';
    case 'rate_limit_exceeded':
      return \`Too many requests. Try again in \${error.retry_after} seconds\`;
    default:
      return 'An error occurred. Please try again later';
  }
}

// Example usage
fetch('https://api.thenews.africa/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${API_KEY}\`
  },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    newsletter_id: 'news_1a2b3c4d5e6f'
  })
})
.then(response => response.json())
.then(data => {
  if (!data.success) {
    const errorMessage = handleApiError(data.error);
    showErrorToUser(errorMessage);
    return;
  }
  
  // Handle success
  showSuccessToUser('Subscription successful!');
})
.catch(error => {
  // Handle network errors
  showErrorToUser('Network error. Please check your connection');
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black font-heading">Performance Optimization</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Cache API responses when appropriate</li>
          <li>Use pagination for large data sets</li>
          <li>Only request the data you need</li>
          <li>Batch operations when possible</li>
          <li>Implement request throttling to avoid rate limits</li>
        </ul>
        <p className="text-muted-foreground mt-4">Here&apos;s an example of caching API responses:</p>
        <ApiCodeBlock
          language="javascript"
          code={`// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

async function fetchWithCache(url, options) {
  const cacheKey = \`\${url}-\${JSON.stringify(options.body || {})}\`;
  
  // Check if we have a cached response
  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    
    // Check if the cache is still valid
    if (Date.now() - timestamp < CACHE_TTL) {
      console.log('Using cached response');
      return data;
    }
    
    // Cache expired, remove it
    cache.delete(cacheKey);
  }
  
  // Make the API request
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Cache the response if it was successful
  if (data.success) {
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  
  return data;
}

// Example usage
fetchWithCache('https://api.thenews.africa/api/newsletters', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${API_KEY}\`
  }
})
.then(data => {
  if (data.success) {
    displayNewsletters(data.data);
  } else {
    handleApiError(data.error);
  }
})
.catch(error => {
  console.error('Network error:', error);
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black font-heading">Security</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Always use HTTPS for API requests</li>
          <li>Validate and sanitize user input before sending it to the API</li>
          <li>Implement proper authentication and authorization in your application</li>
          <li>Keep your API keys secure</li>
          <li>Follow the principle of least privilege</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black font-heading">Testing</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Use the free plan for sandbox testing</li>
          <li>Write automated tests for your API integration</li>
          <li>Test error handling and edge cases</li>
          <li>Use mock responses for testing</li>
          <li>Test rate limiting behavior</li>
        </ul>
      </div>
    </div>
  )
}
