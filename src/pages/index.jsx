import React from 'react';
import { BookmarkProvider } from '@/context/BookmarkContext';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import BookmarkGrid from '@/components/BookmarkGrid';

const Index = () => {
  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto py-6 px-4 md:px-0">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64 shrink-0">
              <div className="sticky top-6">
                <CategoryFilter />
              </div>
            </aside>
            <div className="flex-1">
              <BookmarkGrid />
            </div>
          </div>
        </main>
      </div>
    </BookmarkProvider>
  );
};

export default Index;
