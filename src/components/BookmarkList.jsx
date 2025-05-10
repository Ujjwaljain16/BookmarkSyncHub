import React from 'react';
import { useBookmarkContext } from '@/context/BookmarkContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Trash2, Edit2 } from 'lucide-react';

const BookmarkList = () => {
  const { filteredBookmarks, deleteBookmark } = useBookmarkContext();

  if (filteredBookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookmarks found. Try adjusting your filters or add a new bookmark.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredBookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">{bookmark.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {bookmark.description || bookmark.url}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-4">
              {bookmark.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Badge variant="outline" className="capitalize">
              {bookmark.category}
            </Badge>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(bookmark.url, '_blank')}
              title="Open bookmark"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {/* TODO: Implement edit functionality */}}
                title="Edit bookmark"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteBookmark(bookmark.id)}
                title="Delete bookmark"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BookmarkList; 