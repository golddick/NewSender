export function NewslettersGet() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-black">GET /newsletters</h1>
  
        <div className="prose prose-gray max-w-none">
          <p>Retrieve a list of all newsletters in your account. This endpoint supports pagination and filtering.</p>
  
          <h2>Request</h2>
          <pre className="bg-gray-100 p-3 rounded-md">
            <code>GET https://api.thenews.sixthgrid.com/v1/newsletters</code>
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
                <td className="px-6 py-4 text-sm text-gray-500">Filter by status (draft, scheduled, sent)</td>
              </tr>
            </tbody>
          </table>
  
          <h2>Response</h2>
          <p>Returns a list of newsletter objects and pagination metadata.</p>
  
          <h3>Example Response</h3>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
            <code>{`{
    "data": [
      {
        "id": "news_123456789",
        "title": "May Newsletter",
        "subject": "Your May Update  [
      {
        "id": "news_123456789",
        "title": "May Newsletter",
        "subject": "Your May Update",
        "status": "sent",
        "sent_at": "2023-05-15T10:00:00Z",
        "created_at": "2023-05-10T14:30:00Z",
        "updated_at": "2023-05-15T10:00:00Z",
        "stats": {
          "recipients": 1250,
          "opens": 680,
          "clicks": 215
        }
      },
      {
        "id": "news_987654321",
        "title": "June Newsletter",
        "subject": "Summer Updates and News",
        "status": "draft",
        "sent_at": null,
        "created_at": "2023-06-01T09:15:00Z",
        "updated_at": "2023-06-01T09:15:00Z",
        "stats": null
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "pages": 1
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
                  Forbidden - You don&apos;t have permission to access newsletters
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  