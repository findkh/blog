import { useParams, useNavigate } from "react-router-dom";
import { Loader2, PencilLine, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { usePostDetail } from "../hooks/userGetPost";
import { useDeletePost } from "../hooks/useDeletePost";

interface PostDetailPageProps {
  menuId: number;
  isAdmin?: boolean;
}

export function PostDetailPage({ menuId, isAdmin }: PostDetailPageProps) {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const numericPostId = postId ? Number(postId) : null;

  const deleteMutation = useDeletePost();

  if (!numericPostId || Number.isNaN(numericPostId)) {
    return <div className="py-20 text-center">존재하지 않는 글입니다.</div>;
  }

  const { data, isLoading, isError } = usePostDetail(numericPostId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return <div className="py-20 text-center">존재하지 않는 글입니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        {/* 본문 영역 */}
        <div className="p-8 md:p-12 space-y-6">
          {/* 제목 */}
          <h1 className="text-4xl md:text-5xl font-bold text-card-foreground leading-tight break-words">
            {data.title}
          </h1>

          {/* 메타 정보 영역: 날짜 + 관리자 버튼 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
            {/* 날짜 */}
            <div className="text-sm text-muted-foreground font-medium">
              {new Date(data.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            {/* 관리자 버튼 */}
            {isAdmin && (
              <div className="flex gap-2">
                {/* 수정 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/editor?menuId=${menuId}&postId=${data.id}`);
                  }}
                  title="포스트 수정"
                >
                  <PencilLine className="h-4 w-4" />
                  <span>수정</span>
                </Button>

                {/* 삭제 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
                      deleteMutation.mutate(data.id);
                    }
                  }}
                  title="포스트 삭제"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>삭제</span>
                </Button>
              </div>
            )}
          </div>

          {/* 태그 영역 - 동적으로 표시 */}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-medium px-3 py-1"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 본문 (HTML 그대로) */}
          <div
            className="prose prose-lg max-w-none pt-8
              prose-headings:font-bold prose-headings:text-card-foreground
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-card-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-primary prose-pre:text-primary-foreground
              prose-img:rounded-lg prose-img:shadow-sm
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-strong:text-card-foreground
              prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </article>
    </div>
  );
}
