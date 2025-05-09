export function SubscribersPost() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-black">POST /subscribers</h1>
  
        <div className="prose prose-gray max-w-none">
          <p>
            Add a new subscriber to your list. If the email already exists, the subscriber&apos;s information will be updated.
          </p>
  
          <h2>Request</h2>
          <pre className="bg-gray-100 p-3 rounded-md">
            <code>POST https://api.thenews.sixthgrid.com/v1/subscribers</code>
          </pre>
  
          <h3>Request Body</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">email</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yes</td>
                <td className="px-6 py-4 text-sm text-gray-500">Email address of the subscriber</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">first_name</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                <td className="px-6 py-4 text-sm text-gray-500">First name of the subscriber</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">last_name</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                <td className="px-6 py-4 text-sm text-gray-500">Last name of the subscriber</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">metadata</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">object</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No</td>
                <td className="px-6 py-4 text-sm text-gray-500">Additional metadata about the subscriber</td>
              </tr>
            </tbody>
          </table>
  
          <h3>Example Request</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
            <code>{`{
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "metadata": {
      "source": "website",
      "interests": ["technology", "marketing"]
    }
  }`}</code>
          </pre>
  
          <h2>Response</h2>
          <p>Returns the created or updated subscriber object.</p>
  
          <h3>Example Response</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
            <code>{`{
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">400</td>
                <td className="px-6 py-4 text-sm text-gray-500">Bad Request - Invalid email format</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">401</td>
                <td className="px-6 py-4 text-sm text-gray-500">Unauthorized - Invalid API key</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">429</td>
                <td className="px-6 py-4 text-sm text-gray-500">Too Many Requests - Rate limit exceeded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  