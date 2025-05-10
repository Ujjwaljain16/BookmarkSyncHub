import React from 'react';
// import { BookmarkProvider } from '@/context/BookmarkContext';
// import Header from '@/components/Header';
// import ChromeIntegrationGuide from '@/components/ChromeIntegrationGuide';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardHeader, 
//   CardTitle 
// } from '@/components/ui/card';
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  RefreshCw, 
  Settings as SettingsIcon 
} from 'lucide-react';

const Settings = () => {
  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto py-6 px-4 md:px-0">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-bookmark-primary" />
            Settings
          </h1>
          
          <div className="space-y-8">
            <Tabs defaultValue="integration">
              <TabsList className="w-full">
                <TabsTrigger value="integration">Chrome Integration</TabsTrigger>
                <TabsTrigger value="data">Data Management</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="integration" className="pt-6">
                <ChromeIntegrationGuide />
              </TabsContent>
              
              <TabsContent value="data" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Import, export, or clear your bookmark data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Button className="flex gap-2 w-full md:w-auto">
                        <Download className="h-4 w-4" />
                        Export All Bookmarks
                      </Button>
                      <Button variant="outline" className="flex gap-2 w-full md:w-auto">
                        <Upload className="h-4 w-4" />
                        Import Bookmarks
                      </Button>
                      <Button variant="destructive" className="flex gap-2 w-full md:w-auto">
                        <Trash2 className="h-4 w-4" />
                        Clear All Bookmarks
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="font-semibold mb-2">Data Storage</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Your bookmarks are currently stored locally in your browser.
                        Connect to a cloud account to sync across devices.
                      </p>
                      <div className="flex gap-4">
                        <Button className="flex gap-2 bg-bookmark-primary hover:bg-bookmark-primary/90">
                          <Database className="h-4 w-4" />
                          Connect Cloud Storage
                        </Button>
                        <Button variant="outline" className="flex gap-2" disabled>
                          <RefreshCw className="h-4 w-4" />
                          Sync Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Account features will be implemented in future updates.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </BookmarkProvider>
  );
};

export default Settings;
