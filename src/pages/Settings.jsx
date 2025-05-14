import React, { useState } from 'react';
import { BookmarkProvider } from '@/context/BookmarkContext';
import Header from '@/components/Header';
import ChromeIntegrationGuide from '@/components/ChromeIntegrationGuide';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Download, 
  Upload, 
  Trash2, 
  Database, 
  RefreshCw, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import config from '@/config';

const Settings = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteAllBookmarks = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/bookmarks/all`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmarks');
      }

      toast({
        title: "Success",
        description: "All bookmarks have been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bookmarks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

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
                      <Button 
                        variant="destructive" 
                        className="flex gap-2 w-full md:w-auto"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
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
            </Tabs>
          </div>
        </main>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete all your bookmarks.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAllBookmarks}
              >
                Delete All Bookmarks
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BookmarkProvider>
  );
};
export default Settings;