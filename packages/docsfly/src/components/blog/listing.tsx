'use client';

import { BlogPost } from '../../types';
import { BlogPostComponent } from './post';

interface BlogListingProps {
  posts: BlogPost[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function BlogListing({ 
  posts, 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}: BlogListingProps) {
  
  const Pagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-2 mt-12">
        {currentPage > 1 && (
          <button 
            onClick={() => onPageChange?.(currentPage - 1)}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Previous
          </button>
        )}
        
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange?.(page)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        {currentPage < totalPages && (
          <button 
            onClick={() => onPageChange?.(currentPage + 1)}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-12">
        {posts.map((post) => (
          <div key={post.slug} className="border-b pb-12 last:border-b-0">
            <BlogPostComponent post={post} isExcerpt />
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No blog posts found.</p>
        </div>
      )}
      
      <Pagination />
    </div>
  );
}