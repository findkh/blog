import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { usePostInfinite } from "../hooks/userGetPost";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { PlusCircle, Loader2, PencilLine, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useDeletePost } from "../hooks/useDeletePost";

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

  // HTML 태그 제거용 (카드형 요약에서 사용)
  const getSummary = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim();
  };

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
          <Card
            key={post.id}
            className="group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200"
            onClick={() => navigate(`/dev-log/${post.id}`)}
          >
            {/* 썸네일 */}
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              {post.thumbnail ? (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                  No Thumbnail
                </div>
              )}
            </div>

            {/* 내용 영역 */}
            <CardHeader className="p-5 space-y-3">
              {/* 제목 */}
              <CardTitle className="line-clamp-2 text-xl leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>

              {/* 날짜 */}
              <div className="text-xs text-slate-400 font-medium">
                {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </CardHeader>

            {/* 본문 미리보기 */}
            <CardContent className="px-5 pb-5 flex-grow space-y-4">
              <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                {getSummary(post.content)}
              </p>

              {/* 하단: 태그 + 관리 버튼 */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-medium px-3 py-1"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* 관리 버튼 (Admin만) */}
                {isAdmin && (
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 수정 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editor?menuId=${menuId}&postId=${post.id}`);
                      }}
                      title="포스트 수정"
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>

                    {/* 삭제 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      disabled={deleteMutation.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                      title="포스트 삭제"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
