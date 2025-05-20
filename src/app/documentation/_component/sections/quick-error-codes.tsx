import { ApiCodeBlock } from "../code-block";


export function QuickErrorCodes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-4">Error Codes</h1>
        <p className="text-gray-600 text-lg">
          Learn about the error codes returned by TheNews API and how to handle them.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Error Response Format</h2>
        <p className="text-gray-600">
          When an error occurs, the API will return a JSON object with an error message and code:
        </p>
        <ApiCodeBlock
          language="json"
          code={`{
  "success": false,
  "error": {
    "code": "error_code",
    "message": "A human-readable error message",
    "status": 400,
    "details": { /* Additional error details if available */ }
  }
}`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">HTTP Status Codes</h2>
        <p className="text-gray-600 mb-4">
          The API uses standard HTTP status codes to indicate the success or failure of a request:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Status Code</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-sm text-green-400">200 - OK</td>
                <td className="py-2 px-4 text-sm text-gray-600">The request was successful</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-green-400">201 - Created</td>
                <td className="py-2 px-4 text-sm text-gray-600">The resource was successfully created</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-yellow-400">400 - Bad Request</td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  The request was invalid or missing required parameters
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-yellow-400">401 - Unauthorized</td>
                <td className="py-2 px-4 text-sm text-gray-600">Authentication failed or was not provided</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-yellow-400">403 - Forbidden</td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  The request was valid but the server refused to respond
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-yellow-400">404 - Not Found</td>
                <td className="py-2 px-4 text-sm text-gray-600">The requested resource was not found</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-yellow-400">409 - Conflict</td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  The request conflicts with the current state of the server
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-red-400">429 - Too Many Requests</td>
                <td className="py-2 px-4 text-sm text-gray-600">Rate limit exceeded</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-red-400">500 - Server Error</td>
                <td className="py-2 px-4 text-sm text-gray-600">An error occurred on the server</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Error Codes</h2>
        <p className="text-gray-600 mb-4">
          The API uses the following error codes to provide more specific information about what went wrong:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Error Code</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">HTTP Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">invalid_request</td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  The request was malformed or missing required parameters
                </td>
                <td className="py-2 px-4 text-sm text-gray-600">400</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">invalid_email</td>
                <td className="py-2 px-4 text-sm text-gray-600">The provided email address is invalid</td>
                <td className="py-2 px-4 text-sm text-gray-600">400</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">newsletter_not_found</td>
                <td className="py-2 px-4 text-sm text-gray-600">The specified newsletter does not exist</td>
                <td className="py-2 px-4 text-sm text-gray-600">404</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">subscriber_exists</td>
                <td className="py-2 px-4 text-sm text-gray-600">The subscriber already exists in the newsletter</td>
                <td className="py-2 px-4 text-sm text-gray-600">409</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">unauthorized</td>
                <td className="py-2 px-4 text-sm text-gray-600">Invalid or missing API key</td>
                <td className="py-2 px-4 text-sm text-gray-600">401</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">forbidden</td>
                <td className="py-2 px-4 text-sm text-gray-600">
                  The API key does not have permission to perform this action
                </td>
                <td className="py-2 px-4 text-sm text-gray-600">403</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">rate_limit_exceeded</td>
                <td className="py-2 px-4 text-sm text-gray-600">Rate limit exceeded</td>
                <td className="py-2 px-4 text-sm text-gray-600">429</td>
              </tr>
              <tr>
                <td className="py-2 px-4 text-sm text-amber-600">server_error</td>
                <td className="py-2 px-4 text-sm text-gray-600">An error occurred on the server</td>
                <td className="py-2 px-4 text-sm text-gray-600">500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Error Examples</h2>
        <p className="text-gray-600">Here are some examples of error responses you might encounter:</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-black mb-2">Invalid Email</h3>
            <ApiCodeBlock
              language="json"
              code={`{
  "success": false,
  "error": {
    "code": "invalid_email",
    "message": "The provided email address is invalid",
    "status": 400
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium text-black mb-2">Newsletter Not Found</h3>
            <ApiCodeBlock
              language="json"
              code={`{
  "success": false,
  "error": {
    "code": "newsletter_not_found",
    "message": "The specified newsletter does not exist",
    "status": 404
  }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium text-black mb-2">Rate Limit Exceeded</h3>
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
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Handling Errors</h2>
        <p className="text-gray-600">Here&apos;s an example of how to handle errors in your code:</p>
        <ApiCodeBlock
          language="javascript"
          code={`fetch('https://api.thenews.africa/api/subscribe', {
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
.then(data => {
  if (!data.success) {
    // Handle specific error codes
    switch (data.error.code) {
      case 'invalid_email':
        console.error('Please provide a valid email address');
        break;
      case 'newsletter_not_found':
        console.error('The newsletter does not exist');
        break;
      case 'subscriber_exists':
        console.error('This email is already subscribed');
        break;
      case 'rate_limit_exceeded':
        console.error(\`Too many requests. Try again in \${data.error.retry_after} seconds\`);
        break;
      default:
        console.error(\`Error: \${data.error.message}\`);
    }
    return;
  }
  
  // Handle success
  console.log('Subscription successful!', data);
})
.catch(error => {
  // Handle network errors
  console.error('Network error:', error);
});`}
        />
      </div>
    </div>
  )
}
