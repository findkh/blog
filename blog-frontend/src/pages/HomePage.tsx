import { BlogCard } from "../components/common/BlogCard";
import { Hero } from "../components/home/Hero";
import { useGetHome } from "../hooks/useGetHome";
import { Skeleton } from "../components/ui/skeleton";

interface HomePageProps {
  isAdmin: boolean;
}

// BlogCard 스켈레톤 컴포넌트
function BlogCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function HomePage({ isAdmin }: HomePageProps) {
  const { data, status } = useGetHome();

  if (status === "error") {
    return (
      <div className="text-center py-20 text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      {status === "pending" ? (
        <div className="container mx-auto px-4 py-20">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <Hero hero={data?.hero} />
      )}

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">New Post</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {status === "pending"
              ? // 로딩 중: 스켈레톤 3개 표시
                Array.from({ length: 3 }).map((_, index) => (
                  <BlogCardSkeleton key={index} />
                ))
              : // 로딩 완료: 실제 데이터 표시
                data?.recentPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    menuId={post.menuId}
                    isAdmin={isAdmin}
                    onDelete={() => {}}
                    isDeleting={false}
                  />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
