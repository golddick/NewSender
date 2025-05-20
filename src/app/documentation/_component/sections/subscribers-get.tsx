export function SubscribersGet() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">GET /subscribe</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          Retrieve a paginated list of all subscribers linked to your newsletter. You can filter results using query parameters.
        </p>

        <h2>Request</h2>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>GET https://thenews.africa/api/subscribe?page=1&amp;limit=20&amp;status=Subscribed</code>
        </pre>

        <h3>Query Parameters</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">page</td>
              <td className="px-6 py-4 text-sm text-gray-500">integer</td>
              <td className="px-6 py-4 text-sm text-gray-500">Page number (default: 1)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">limit</td>
              <td className="px-6 py-4 text-sm text-gray-500">integer</td>
              <td className="px-6 py-4 text-sm text-gray-500">Number of records per page (default: 20, max: 100)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">status</td>
              <td className="px-6 py-4 text-sm text-gray-500">string</td>
              <td className="px-6 py-4 text-sm text-gray-500">Filter by subscriber status (e.g. Subscribed, Unsubscribed)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">search</td>
              <td className="px-6 py-4 text-sm text-gray-500">string</td>
              <td className="px-6 py-4 text-sm text-gray-500">Search by email or source</td>
            </tr>
          </tbody>
        </table>

        <h2>Response</h2>
        <p>Returns a list of subscribers with pagination info.</p>

        <h3>Example Response</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{`{
  "success": true,
  "data": [
    {
      "_id": "sub_123456789",
      "email": "john@example.com",
      "status": "Subscribed",
      "source": "API - Website Form",
      "createdAt": "2025-05-01T12:00:00Z",
      "metadata": {
        "campaign": "spring-launch",
        "pageUrl": "https://example.com/subscribe",
        "formId": "form-001"
      }
    },
    {
      "_id": "sub_987654321",
      "email": "jane@example.com",
      "status": "Subscribed",
      "source": "API - Referral",
      "createdAt": "2025-05-02T09:30:00Z",
      "metadata": {
        "campaign": null,
        "pageUrl": "https://another.com",
        "formId": null
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "pages": 3
  }
}`}</code>
        </pre>

        <h2>Error Codes</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">401</td>
              <td className="px-6 py-4 text-sm text-gray-500">Unauthorized – Invalid API key</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">403</td>
              <td className="px-6 py-4 text-sm text-gray-500">Forbidden – No active subscription</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">429</td>
              <td className="px-6 py-4 text-sm text-gray-500">Too Many Requests – Rate limit exceeded</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
