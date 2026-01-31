import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { usePostInfinite } from "../hooks/userGetPost";
import { Button } from "../components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeletePost } from "../hooks/useDeletePost";
import { BlogCard } from "../components/common/BlogCard";

export function DevLogPage({
  menuId,
  isAdmin,
}: {
  menuId: number;
  isAdmin?: boolean;
}) {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePostInfinite(menuId);
  const allPosts = data?.pages.flatMap((page) => page.content) || [];
  const deleteMutation = useDeletePost();

  // 무한 스크롤 로직
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-20 text-red-500">
        데이터를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* --- 상단 헤더 섹션 --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Dev Log
          </h1>
          <p className="text-muted-foreground font-medium">
            개발 여정의 기록들을 공유합니다.
          </p>
        </div>

        {/* 오른쪽: 추가 버튼 */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={() => navigate(`/editor?menuId=${menuId}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>새 글</span>
            </Button>
          )}
        </div>
      </div>

      {/* --- 포스트 리스트 영역 --- */}
      <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
        {allPosts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            menuId={menuId}
            isAdmin={isAdmin}
            onDelete={(postId) => deleteMutation.mutate(postId)}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>

      {/* --- 하단 로딩/트리거 영역 --- */}
      <div
        ref={ref}
        className="py-20 flex justify-center border-t border-slate-50"
      >
        {isFetchingNextPage ? (
          <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        ) : !hasNextPage && allPosts.length > 0 ? (
          <div className="text-center space-y-2">
            <p className="text-slate-400 font-bold italic">
              End of the Journey
            </p>
            <p className="text-sm text-slate-300 font-medium tracking-widest">
              2026 LOG COLLECTION
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
