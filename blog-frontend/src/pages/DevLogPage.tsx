import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { usePostInfinite } from "../hooks/userGetPost";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { PlusCircle, Loader2, LayoutGrid, List, PencilLine, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useDeletePost } from "../hooks/useDeletePost";

export function DevLogPage({ menuId, isAdmin }: { menuId: number; isAdmin?: boolean }) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"feed" | "card">("feed");
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = usePostInfinite(menuId);
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
    return <div className="text-center py-20 text-red-500">데이터를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* --- 상단 헤더 섹션 --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Dev Log</h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground font-medium">개발 여정의 기록들을 공유합니다.</p>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="h-9">
              <TabsList>
                <TabsTrigger value="feed" className="gap-2">
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="card" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isAdmin && (
          <Button onClick={() => navigate(`/editor?menuId=${menuId}`)} size="lg" className="shadow-md">
            <PlusCircle className=" h-5 w-5" />
          </Button>
        )}
      </div>

      {/* --- 포스트 리스트 영역 --- */}
      <div
        className={
          viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "max-w-3xl mx-auto space-y-20"
        }
      >
        {allPosts.map((post) =>
          viewMode === "card" ? (
            /* [1] 카드형 스타일: 요약된 정보를 타일 형태로 배치 */
            <Card
              key={post.id}
              className="group overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200"
              onClick={() => navigate(`/post/${post.id}`)}
            >
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
              <CardHeader className="p-5 space-y-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1 text-xl leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 flex-grow">
                <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">{getSummary(post.content)}</p>
              </CardContent>
            </Card>
          ) : (
            /* [2] 피드형 스타일: 전체 내용을 페이스북처럼 나열 */
            <article key={post.id} className="space-y-8 pb-20 border-b last:border-0 border-slate-100">
              <header className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{post.title}</h2>
                </div>
                <div className="flex items-center text-base text-slate-500 font-semibold italic">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </header>

              {/* 피드형 대표 이미지 */}
              {post.thumbnail && (
                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              {/* 본문 렌더링: 에디터에서 작성한 스타일 유지 */}
              <div
                className="prose prose-slate lg:prose-xl max-w-none 
                  prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed
                  prose-img:rounded-2xl prose-img:shadow-lg prose-code:text-primary"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              {/* 피드 하단 관리 액션 */}
              <div className="pt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-slate-400 border-slate-200">
                    #Development
                  </Badge>
                  <Badge variant="outline" className="text-slate-400 border-slate-200">
                    #Log
                  </Badge>
                </div>
                {isAdmin && (
                  <div className="flex gap-1">
                    {/* 수정 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon" // 정사각형 아이콘 버튼으로 설정
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않게 방지
                        navigate(`/editor?menuId=${menuId}&postId=${post.id}`);
                      }}
                      className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="포스트 수정"
                    >
                      <PencilLine className="h-5 w-5" />
                    </Button>

                    {/* 삭제 버튼 */}
                    <Button
                      variant="ghost"
                      size="icon"
                      // 2. 삭제 중일 때 버튼 비활성화 (선택 사항)
                      disabled={deleteMutation.isPending}
                      onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                        if (confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
                          // 3. mutate 호출
                          deleteMutation.mutate(post.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="포스트 삭제"
                    >
                      {/* 삭제 중이면 로딩 아이콘, 아니면 휴지통 아이콘 */}
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ),
        )}
      </div>

      {/* --- 하단 로딩/트리거 영역 --- */}
      <div ref={ref} className="py-20 flex justify-center border-t border-slate-50">
        {isFetchingNextPage ? (
          <Loader2 className="h-10 w-10 animate-spin text-slate-300" />
        ) : !hasNextPage && allPosts.length > 0 ? (
          <div className="text-center space-y-2">
            <p className="text-slate-400 font-bold italic">End of the Journey</p>
            <p className="text-sm text-slate-300 font-medium tracking-widest">2026 LOG COLLECTION</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
