import React, { useState } from 'react';
import { BookmarkProvider } from '@/context/BookmarkContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mockReceiveFromExtension } from '@/services/bookmarkApi';
import { toast } from 'sonner';
import { Chrome, Code, Send, Download, Github, ExternalLink } from 'lucide-react';

const ApiDemo = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url || !title) {
      toast.error('URL and title are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await mockReceiveFromExtension({
        url,
        title,
        description,
      });

      toast.success('Bookmark received successfully');
      setLastResult(response);

      // Clear form
      setUrl('');
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error sending bookmark:', error);
      toast.error('Failed to process bookmark');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto py-6 px-4 md:px-0">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Chrome className="h-6 w-6 text-bookmark-primary" />
            Chrome Extension API Demo
          </h1>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Test Extension API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  This form simulates sending a bookmark from the Chrome extension.
                  Fill in the details and submit to see how the API endpoint processes the data.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium mb-1">URL</label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      id="title"
                      placeholder="Bookmark Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description (optional)
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Description of the bookmark"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-bookmark-primary hover:bg-bookmark-primary/90"
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? 'Sending...' : 'Send Bookmark'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  The response from the API will be displayed here after submitting the form.
                </p>

                <div className="bg-gray-100 p-4 rounded-md min-h-[240px]">
                  {lastResult ? (
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(lastResult, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Code className="h-10 w-10 mx-auto mb-2" />
                        <p>No data yet. Submit the form to see the response.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chrome Extension Downloads</CardTitle>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Extension
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-5 rounded-md border border-gray-100 mb-6">
                  <h3 className="text-lg font-medium mb-3">Installation Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Download the extension zip file using the button above</li>
                    <li>Extract the zip file to a folder on your computer</li>
                    <li>Open Chrome and navigate to <code className="bg-gray-100 px-1 py-0.5 rounded">chrome://extensions/</code></li>
                    <li>Enable "Developer mode" using the toggle in the top-right corner</li>
                    <li>Click "Load unpacked" and select the extracted extension folder</li>
                    <li>The Bookmark Hub icon should appear in your browser toolbar</li>
                    <li>Click the extension icon and go to Settings to configure your API URL</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Extension Features</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Manual Bookmarking</h4>
                      <p className="text-sm text-gray-600">
                        Click the extension icon to save the current page with custom details
                        like descriptions, categories, and tags.
                      </p>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Context Menu</h4>
                      <p className="text-sm text-gray-600">
                        Right-click on any page or link and select "Save to Bookmark Hub"
                        to quickly add it to your collection.
                      </p>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Auto-Sync (Coming Soon)</h4>
                      <p className="text-sm text-gray-600">
                        Automatically sync new Chrome bookmarks with your Bookmark Hub
                        account when enabled in extension settings.
                      </p>
                    </div>

                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">API Integration</h4>
                      <p className="text-sm text-gray-600">
                        Configurable API endpoint to connect with your personal or
                        team's Bookmark Hub deployment.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Chrome Extension Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Want to contribute to the extension or customize it for your needs?
                  The extension source code is available in the project repository.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    View Source Code
                  </Button>

                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Chrome Extension Documentation
                  </Button>
                </div>

                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-sm font-semibold mb-2">Example Chrome Extension Code</h3>
                  <pre className="text-xs overflow-x-auto">
{`// popup.js - Chrome Extension Popup Script
document.getElementById('sendBookmarkBtn').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    
    fetch('https://your-bookmark-hub.com/api/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_AUTH_TOKEN'
      },
      body: JSON.stringify({
        url: activeTab.url,
        title: activeTab.title,
        source: 'extension'
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Bookmark saved:', data);
    })
    .catch(error => {
      console.error('Error saving bookmark:', error);
    });
  });
});`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </BookmarkProvider>
  );
};

export default ApiDemo;
