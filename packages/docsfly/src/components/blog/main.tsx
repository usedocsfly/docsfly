import { getConfig } from "../../config";
import { getAllBlogPosts, getBlogPostBySlug } from "../../docs";
import { BlogListing } from "./listing";
import { BlogPostComponent } from "./post";

export async function BlogMain({
  params: _params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  // Await the params to ensure they are resolved before passing to DocsPage
  const params = await _params;
  const config = getConfig();

  const BlogLister = async () => {
    const posts = await getAllBlogPosts();
    const config = getConfig();
    return (
      <div className="flex flex-col gap-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {config.blog?.title || "Blog"}
          </h1>
          <p className="text-muted-foreground">
            {config.blog?.description || "Latest updates and articles"}
          </p>
        </header>
        <BlogListing posts={posts} config={config} />
      </div>
    );
  };

  // If no slug provided, show blog listing
  if (!params.slug || params.slug.length === 0) {
    return <BlogLister />;
  }

  // Try to get specific post
  const slug = params.slug.join("/");
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    // Post not found, show blog listing
    return <BlogLister />;
  }

  return <BlogPostComponent post={post} config={config} />;
}
