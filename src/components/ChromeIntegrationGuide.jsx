import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, Chrome, Code, Download, Info, BookmarkIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ChromeIntegrationGuide = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Chrome className="h-6 w-6 text-bookmark-primary" />
          <CardTitle>Chrome Extension Integration</CardTitle>
        </div>
        <CardDescription>
          Connect your Chrome bookmarks to Bookmark Hub with our browser extension
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="guide">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Installation Guide</TabsTrigger>
            <TabsTrigger value="code">Developer Notes</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="pt-4">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Extension Coming Soon</AlertTitle>
                <AlertDescription>
                  Our Chrome extension is currently in development. Follow these steps to test the integration when ready.
                </AlertDescription>
              </Alert>

              <div className="space-y-6">
                <InstallationStep
                  number={1}
                  title="Download the Extension"
                  description="Download the Chrome extension package from our website."
                  icon={<Download className="h-5 w-5" />}
                >
                  <Button variant="outline" disabled className="mt-2">
                    <Download className="mr-2 h-4 w-4" />
                    Download Extension (Coming Soon)
                  </Button>
                </InstallationStep>

                <InstallationStep
                  number={2}
                  title="Install in Chrome"
                  description="Open Chrome and navigate to chrome://extensions. Enable 'Developer mode' and click 'Load unpacked'. Select the downloaded extension folder."
                  icon={<Chrome className="h-5 w-5" />}
                />

                <InstallationStep
                  number={3}
                  title="Connect to Your Account"
                  description="Click on the extension icon in your browser toolbar. Log in with your Bookmark Hub account credentials to start syncing."
                  icon={<Info className="h-5 w-5" />}
                />

                <InstallationStep
                  number={4}
                  title="Enable Auto-Sync (Optional)"
                  description="To automatically sync bookmarks when you click Chrome's star icon, go to the extension settings and enable the 'Auto-sync Chrome bookmarks' option."
                  icon={<BookmarkIcon className="h-5 w-5" />}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Extension Architecture</h3>
                <p className="text-sm text-gray-600">
                  The extension uses a background script to monitor bookmark changes and
                  synchronize with your Bookmark Hub account via our API. It captures bookmark
                  metadata, including title, URL, and favicon.
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-xs overflow-x-auto">
{`// Example background.js script for Chrome extension
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  chrome.storage.sync.get(['autoSync', 'apiUrl'], (settings) => {
    if (settings.autoSync && settings.apiUrl) {
      sendBookmarkToApi({
        url: bookmark.url,
        title: bookmark.title,
        category: 'other',
        tags: [],
        source: 'extension'
      });
    }
  });
});

async function sendBookmarkToApi(bookmarkData) {
  const response = await fetch('https://your-bookmark-hub.com/api/bookmarks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${userToken}\`
    },
    body: JSON.stringify(bookmarkData)
  });
  return response.json();
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Custom Development</h3>
                <p className="text-sm text-gray-600">
                  You can create your own Chrome extension using our API to sync bookmarks.
                  Check our GitHub repository for a sample extension project.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">API Endpoints</h3>
                <p className="text-sm text-gray-600">
                  Use these endpoints to interact with the Bookmark Hub API:
                </p>
              </div>

              <div className="space-y-4">
                <ApiEndpoint
                  method="POST"
                  endpoint="/api/bookmarks"
                  description="Add a new bookmark"
                  requestSample={`{
  "url": "https://example.com",
  "title": "Example Website",
  "description": "An example website description",
  "category": "development",
  "tags": ["example", "web"]
}`}
                />

                <ApiEndpoint
                  method="GET"
                  endpoint="/api/bookmarks"
                  description="Get all bookmarks"
                />

                <ApiEndpoint
                  method="DELETE"
                  endpoint="/api/bookmarks/:id"
                  description="Delete a bookmark"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Authentication</h3>
                <p className="text-sm text-gray-600">
                  All API requests require a valid JWT token in the Authorization header:
                </p>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">
          <Code className="mr-2 h-4 w-4" />
          View Documentation
        </Button>
        <Button className="bg-bookmark-primary hover:bg-bookmark-primary/90">
          <Chrome className="mr-2 h-4 w-4" />
          Install Extension (Soon)
        </Button>
      </CardFooter>
    </Card>
  );
};

const InstallationStep = ({ number, title, description, icon, children }) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bookmark-light text-bookmark-primary">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        {children}
      </div>
    </div>
  );
};

const ApiEndpoint = ({ method, endpoint, description, requestSample }) => {
  const methodColors = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center p-2 bg-gray-50 border-b">
        <span className={`px-2 py-0.5 rounded text-xs font-mono ${methodColors[method]}`}>
          {method}
        </span>
        <code className="ml-2 font-mono text-sm">{endpoint}</code>
      </div>
      <div className="p-3">
        <p className="text-sm">{description}</p>
        {requestSample && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Request Body:</p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {requestSample}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChromeIntegrationGuide;
