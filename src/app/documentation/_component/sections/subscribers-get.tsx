export function SubscribersGet() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-black">GET /subscribers</h1>
  
        <div className="prose prose-gray max-w-none">
          <p>Retrieve a list of all subscribers in your account. This endpoint supports pagination and filtering.</p>
  
          <h2>Request</h2>
          <pre className="bg-gray-100 p-3 rounded-md">
            <code>GET https://api.thenews.sixthgrid.com/v1/subscribers</code>
          </pre>
  
          <h3>Query Parameters</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">page</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">integer</td>
                <td className="px-6 py-4 text-sm text-gray-500">Page number (default: 1)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">limit</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">integer</td>
                <td className="px-6 py-4 text-sm text-gray-500">Number of records per page (default: 20, max: 100)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">status</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                <td className="px-6 py-4 text-sm text-gray-500">Filter by status (active, unsubscribed, bounced)</td>
              </tr>
            </tbody>
          </table>
  
          <h2>Response</h2>
          <p>Returns a list of subscriber objects and pagination metadata.</p>
  
          <h3>Example Response</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
            <code>{`{
    "data": [
      {
        "id": "sub_123456789",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "status": "active",
        "created_at": "2023-05-01T12:00:00Z",
        "updated_at": "2023-05-01T12:00:00Z",
        "metadata": {
          "source": "website",
          "interests": ["technology", "marketing"]
        }
      },
      {
        "id": "sub_987654321",
        "email": "jane@example.com",
        "first_name": "Jane",
        "last_name": "Smith",
        "status": "active",
        "created_at": "2023-05-02T14:30:00Z",
        "updated_at": "2023-05-02T14:30:00Z",
        "metadata": {
          "source": "referral",
          "interests": ["business", "finance"]
        }
      }
    ],
    "meta": {
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">401</td>
                <td className="px-6 py-4 text-sm text-gray-500">Unauthorized - Invalid API key</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">403</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Forbidden - You don&apos;t have permission to access subscribers
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  