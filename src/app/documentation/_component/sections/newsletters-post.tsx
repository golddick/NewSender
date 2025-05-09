"use client"

export function NewslettersPost() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">POST /newsletters</h1>

      <div className="prose prose-gray max-w-none">
        <p>Create a new newsletter in your account.</p>

        <h2>Request</h2>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>POST https://api.thenews.sixthgrid.com/v1/newsletters</code>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">title</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yes</td>
              <td className="px-6 py-4 text-sm text-gray-500">The title of the newsletter</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">subject</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yes</td>
              <td className="px-6 py-4 text-sm text-gray-500">The subject line of the newsletter</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">body</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yes</td>
              <td className="px-6 py-4 text-sm text-gray-500">The HTML content of the newsletter</td>
            </tr>
          </tbody>
        </table>

        <h3>Example Request</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{`{
  "title": "May Newsletter",
  "subject": "Your May Update",
  "body": "<p>Hello, world!</p>"
}`}</code>
        </pre>

        <h2>Response</h2>
        <p>Returns the created newsletter object.</p>

        <h3>Example Response</h3>
        <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
          <code>{`{
  "id": "news_123456789",
  "title": "May Newsletter",
  "subject": "Your May Update",
  "status": "draft",
  "sent_at": null,
  "created_at": "2023-05-10T14:30:00Z",
  "updated_at": "2023-05-10T14:30:00Z",
  "stats": null
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
              <td className="px-6 py-4 text-sm text-gray-500">Bad Request - Invalid request body</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">401</td>
              <td className="px-6 py-4 text-sm text-gray-500">Unauthorized - Invalid API key</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">403</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                Forbidden - You don&apos;t have permission to create newsletters
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
