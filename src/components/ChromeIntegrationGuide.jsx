import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Chrome, Download, Info, BookmarkIcon } from 'lucide-react';
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
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">
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

export default ChromeIntegrationGuide;
