export function SubscribersPost() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">POST /subscribe</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          Add a new subscriber to your newsletter list. If the email already exists, their information will be updated.
        </p>

        <h2>Request</h2>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>POST https://thenews.africa/api/subscribe</code>
        </pre>

        <h3>Request Body</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">email</td>
              <td className="px-6 py-4 text-sm text-gray-500">string</td>
              <td className="px-6 py-4 text-sm text-gray-500">Yes</td>
              <td className="px-6 py-4 text-sm text-gray-500">Email address of the subscriber</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">categoryId</td>
              <td className="px-6 py-4 text-sm text-gray-500">string</td>
              <td className="px-6 py-4 text-sm text-gray-500">Yes</td>
              <td className="px-6 py-4 text-sm text-gray-500">ID of the category to associate the subscriber with and to know the category of the newsletter</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">source</td>
              <td className="px-6 py-4 text-sm text-gray-500">string</td>
              <td className="px-6 py-4 text-sm text-gray-500">Yes</td>
              <td className="px-6 py-4 text-sm text-gray-500">Describes the source of subscription (e.g., &quot;website&quot;)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">metadata</td>
              <td className="px-6 py-4 text-sm text-gray-500">object</td>
              <td className="px-6 py-4 text-sm text-gray-500">No</td>
              <td className="px-6 py-4 text-sm text-gray-500">Additional information such as campaign, pageUrl, or formId</td>
            </tr>
          </tbody>
        </table>

        <h3>Example Request</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{`{
  "email": "john@example.com",
  "categoryId": "64f10dd3a9b23c5aebf1e123",
  "source": "Website Form",
  "metadata": {
    "campaign": "spring-launch",
    "pageUrl": "https://example.com/subscribe",
    "formId": "signup-form-001"
  }
}`}</code>
        </pre>

        <h2>Response</h2>
        <p>Returns the newly created or updated subscriber object.</p>

        <h3>Example Response</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{`{
  "success": true,
  "data": {
    "_id": "sub_123456789",
    "email": "john@example.com",
    "newsLetterOwnerId": "user_123",
    "category": "64f10dd3a9b23c5aebf1e123",
    "source": "API - Website Form",
    "status": "Subscribed",
    "metadata": {
      "campaign": "spring-launch",
      "pageUrl": "https://example.com/subscribe",
      "formId": "signup-form-001"
    },
    "createdAt": "2025-05-20T12:00:00Z",
    "updatedAt": "2025-05-20T12:00:00Z"
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
              <td className="px-6 py-4 text-sm font-medium text-gray-900">400</td>
              <td className="px-6 py-4 text-sm text-gray-500">Bad Request – Missing or invalid fields</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">401</td>
              <td className="px-6 py-4 text-sm text-gray-500">Unauthorized – Invalid or missing API key</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">403</td>
              <td className="px-6 py-4 text-sm text-gray-500">Forbidden – No active subscription for API key</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">429</td>
              <td className="px-6 py-4 text-sm text-gray-500">Too Many Requests – Rate limit exceeded - Usage limit exceeded</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
