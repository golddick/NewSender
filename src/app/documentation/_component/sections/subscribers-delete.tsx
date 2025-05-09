export function SubscribersDelete() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-black">DELETE /subscribers/:id</h1>
  
        <div className="prose prose-gray max-w-none">
          <p>Remove a subscriber from your list. This action is permanent and cannot be undone.</p>
  
          <h2>Request</h2>
          <pre className="bg-gray-100 p-3 rounded-md">
            <code>DELETE https://api.thenews.sixthgrid.com/v1/subscribers/:id</code>
          </pre>
  
          <h3>Path Parameters</h3>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">id</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                <td className="px-6 py-4 text-sm text-gray-500">The unique identifier of the subscriber</td>
              </tr>
            </tbody>
          </table>
  
          <h2>Response</h2>
          <p>Returns a confirmation of the deletion.</p>
  
          <h3>Example Response</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
            <code>{`{
    "success": true,
    "message": "Subscriber deleted successfully"
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
                  Forbidden - You don&apos;t have permission to delete subscribers
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">404</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Not Found - Subscriber with the specified ID does not exist
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  