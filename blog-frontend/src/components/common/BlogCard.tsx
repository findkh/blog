import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { PencilLine, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../components/ui/card";
import type { PostResponse } from "../../axios/post/post";

interface BlogCardProps {
  post: PostResponse;
  menuId: number;
  isAdmin?: boolean;
  onDelete: (postId: number) => void;
  isDeleting?: boolean;
}

export function BlogCard({
  post,
  menuId,
  isAdmin,
  onDelete,
  isDeleting,
}: BlogCardProps) {
  const navigate = useNavigate();

  const getSummary = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "").trim();
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/dev-log/${post.id}`)}
    >
      {/* 썸네일 */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        )}
      </div>

      {/* 내용 영역 */}
      <CardHeader>
        <CardDescription className="text-xs md:text-sm">
          {new Date(post.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
        {/* CardTitle 대신 h3 직접 사용 */}
        <h3 className="line-clamp-2 text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>
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
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
                    onDelete(post.id);
                  }
                }}
                title="포스트 삭제"
              >
                {isDeleting ? (
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
  );
}
