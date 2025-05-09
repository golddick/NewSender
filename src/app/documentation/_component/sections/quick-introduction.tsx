

'use client';

import { useState } from 'react';
import { Copy } from 'lucide-react'; 

export function QuickIntroduction() {
  const baseUrl = 'https://api.thenews.sixthgrid.com/v1/api/subscribers';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-black">TheNews API Documentation</h1>

      <div className="prose prose-gray max-w-none">
        <p>
          Welcome to the TheNews API documentation. TheNews is a powerful email marketing platform that allows you to
          manage subscribers, create and send newsletters, and track analytics.
        </p>

        <h2>Overview</h2>
        <p>
          The TheNews API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded
          request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and
          verbs.
        </p>

        <h2>Base URL</h2>
        <p>All API requests should be made to:</p>

        <div className="bg-black rounded-md">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <span className="text-white">API Base URL</span>
            <button
              onClick={() => copyToClipboard(baseUrl)}
              className="text-gray-400 hover:text-white flex items-center gap-1"
            >
              {copied ? 'Copied!' : <Copy size={16} />}
            </button>
          </div>
          <pre className="p-4 text-amber-400 overflow-x-auto scrollbar-thin">
            {baseUrl}
          </pre>
        </div>

        <h2>Available Endpoints</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              ['POST /api/subscribe', 'Add a new subscriber to your list'],
              ['GET /api/subscribers', 'List all subscribers'],
              ['DELETE /api/subscribers/:id', 'Remove a subscriber'],
              ['POST /api/newsletters', 'Create a new newsletter'],
              ['GET /api/newsletters', 'List all newsletters'],
            ].map(([endpoint, description]) => (
              <tr key={endpoint}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{endpoint}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Available
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="my-12 p-8 bg-amber-50 border border-amber-200 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">Coming Soon</h2>
        <p className="text-amber-700 text-lg mb-6">
          We&apos;re working on expanding our API with exciting new features and endpoints!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['Analytics API', 'Track performance metrics for your newsletters'],
            ['Webhooks', 'Real-time event notifications'],
            ['Templates API', 'Create and manage newsletter templates'],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="bg-white p-4 rounded-md shadow-sm border border-amber-100"
            >
              <h3 className="font-semibold text-amber-900">{title}</h3>
              <p className="text-amber-700 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-gray max-w-none">
        <h2>API Versioning</h2>
        <p>
          The TheNews API is versioned to ensure backward compatibility. The current version is <strong>v0.5</strong>.
          When we make breaking changes, we&apos;ll release a new version and provide migration guides.
        </p>
      </div>
    </div>
  );
}
