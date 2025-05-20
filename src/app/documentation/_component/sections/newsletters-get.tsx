export function CategoriesGet() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">GET /categories</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          Retrieve a list of newsletter categories associated with your account. Each category includes its campaigns. 
          <strong>Note:</strong> It&apos;s important to create categories in the news dashboard, as they determine the sections or topics that users can subscribe to.
        </p>

        <h2>Request</h2>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>GET https://thenews.africa/api/category</code>
        </pre>

        <h3>Headers</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Header</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">TheNews-api-key</td>
              <td className="px-6 py-4 text-sm text-gray-500">string</td>
              <td className="px-6 py-4 text-sm text-gray-500">Your API key (required)</td>
            </tr>
          </tbody>
        </table>

        <h2>Response</h2>
        <p>Returns an array of categories. Each category includes an array of campaigns. These categories help determine what sections or topics users are subscribing to.</p>

        <h3>Example Response</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{`{
  "data": [
    {
      "_id": "cat_001",
      "name": "Product Updates",
      "description": "News about new features and releases.",
      "createdAt": "2025-04-01T10:00:00Z",
      "campaigns": [
        {
          "_id": "camp_001",
          "name": "Spring Launch",
          "description": "Launch of the spring product line",
          "status": "Scheduled",
          "startDate": "2025-04-10T00:00:00Z",
          "endDate": "2025-04-20T00:00:00Z",
          "emailsSent": 1500,
          "subscriberCount": 980
        }
      ]
    },
    {
      "_id": "cat_002",
      "name": "Weekly Digest",
      "description": "A weekly roundup of news and articles.",
      "createdAt": "2025-03-20T08:45:00Z",
      "campaigns": []
    }
  ]
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
              <td className="px-6 py-4 text-sm font-medium text-gray-900">403</td>
              <td className="px-6 py-4 text-sm text-gray-500">Forbidden – Invalid or missing API key</td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">500</td>
              <td className="px-6 py-4 text-sm text-gray-500">Internal Server Error – Failed to fetch data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
