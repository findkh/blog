import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { BlogCard } from "./components/BlogCard";
import { BlogTable } from "./components/BlogTable";
import { Footer } from "./components/Footer";
import { AdminLogin } from "./components/AdminLogin";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "admin">("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const blogPosts = [
    {
      id: 1,
      title:
        "Modern JavaScript: Essential Features Every Developer Should Know",
      excerpt:
        "Explore the latest JavaScript features that are transforming how we write code. From async/await to optional chaining, discover what makes modern JS powerful.",
      category: "Web Development",
      date: "January 18, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1595623654300-b27329804025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwY29kaW5nfGVufDF8fHx8MTc2ODk0NDkyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "The Art of UI/UX Design: Creating Intuitive User Experiences",
      excerpt:
        "Learn the principles of great design and how to create interfaces that users love. Discover best practices for wireframing, prototyping, and user testing.",
      category: "Design",
      date: "January 15, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1615220367990-1940567341f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjkwMTg5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: "Building Responsive Web Apps with React and TypeScript",
      excerpt:
        "A comprehensive guide to building scalable, type-safe web applications. Learn how to leverage TypeScript's power in your React projects.",
      category: "Tutorial",
      date: "January 12, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1637937459053-c788742455be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvbXB1dGVyfGVufDF8fHx8MTc2OTA0MDcyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      title: "Productivity Hacks for Developers: Work Smarter, Not Harder",
      excerpt:
        "Discover tools, techniques, and habits that can boost your coding productivity. From keyboard shortcuts to automation scripts.",
      category: "Productivity",
      date: "January 10, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1672858460787-fb29ed7352f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGxhcHRvcCUyMGNvZmZlZXxlbnwxfHx8fDE3NjkwNDA3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      title: "The Future of Web Development: Trends to Watch in 2026",
      excerpt:
        "Stay ahead of the curve with insights into emerging technologies and methodologies shaping the future of web development.",
      category: "Technology",
      date: "January 8, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1573757056004-065ad36e2cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI3ODQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 6,
      title: "Collaborative Coding: Best Practices for Team Development",
      excerpt:
        "Learn how to work effectively in development teams. Cover version control, code reviews, and communication strategies.",
      category: "Team Work",
      date: "January 5, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwdGVhbXxlbnwxfHx8fDE3Njg5MjkxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setCurrentPage("home");
  };

  const handleAdminClick = () => {
    setCurrentPage("admin");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  // Show admin login page
  if (currentPage === "admin" && !isAdmin) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Show main blog page
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onAdminClick={handleAdminClick}
        isAdmin={isAdmin}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <main className="flex-1">
        <Hero />

        {/* Admin Badge */}
        {isAdmin && (
          <div className="container mx-auto px-4 -mt-8 mb-8">
            <div className="flex items-center justify-center">
              <Badge variant="default" className="px-4 py-2">
                Admin Mode Active
              </Badge>
            </div>
          </div>
        )}

        {/* Blog Grid/Table Section */}
        <section id="blog" className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    date={post.date}
                    imageUrl={post.imageUrl}
                  />
                ))}
              </div>
            ) : (
              <BlogTable posts={blogPosts} />
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-secondary-foreground mb-4">
                Subscribe to our newsletter
              </h2>
              <p className="text-secondary-foreground/80 mb-8">
                Get the latest articles and updates delivered directly to your
                inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 max-w-md"
                />
                <Button size="lg">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
