import React, { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import { useSearchParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import {
  useImageUpload,
  usePostSave,
  usePostUpdate,
} from "../../hooks/userPostSave";
import { usePostDetail } from "../../hooks/userGetPost";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Toolbar } from "./Toolbar";
import { ThumbnailSelector } from "./ThumbnailSelector";

export default function TiptapEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. URL 파라미터 추출
  const queryMenuId = searchParams.get("menuId");
  const postId = searchParams.get("postId");
  const isEditMode = !!postId;

  // 2. 상태 관리
  const [title, setTitle] = useState("");
  const [allUploadedDuringSession, setAllUploadedDuringSession] = useState<
    Set<string>
  >(new Set());
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    null,
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // 3. API 훅
  const { data: existingPost, isLoading: isPostLoading } = usePostDetail(
    postId ? Number(postId) : null,
  );
  const imageMutation = useImageUpload();
  const postSaveMutation = usePostSave();
  const postUpdateMutation = usePostUpdate();

  const extractImageUrls = (html: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img"))
      .map((img) => img.getAttribute("src"))
      .filter((src): src is string => Boolean(src));
  };

  // 4. 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: false }),
      Link.configure({ openOnClick: false }),
      ImageResize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const currentUrls = extractImageUrls(html);
      setUploadedImages(currentUrls);

      setSelectedThumbnail((prev) => {
        if (prev && currentUrls.includes(prev)) return prev;
        return currentUrls.length > 0 ? currentUrls[0] : null;
      });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[60vh] max-w-none p-6",
      },
    },
  });

  // 5. 수정 모드일 때 기존 데이터 세팅
  useEffect(() => {
    if (existingPost && editor) {
      setTitle(existingPost.title);
      editor.commands.setContent(existingPost.content);
      setSelectedThumbnail(existingPost.thumbnail || null);

      const existingImages = extractImageUrls(existingPost.content);
      setAllUploadedDuringSession(new Set(existingImages));
      setUploadedImages(existingImages);

      // 기존 태그 로드
      if (existingPost.tags && Array.isArray(existingPost.tags)) {
        setTags(existingPost.tags);
      }
    }
  }, [existingPost, editor]);

  if (!editor || (isEditMode && isPostLoading)) {
    return (
      <div className="flex justify-center py-20">데이터를 불러오는 중...</div>
    );
  }

  // 6. 이미지 업로드
  const handleImageUploadToServer = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await imageMutation.mutateAsync(file);
      setAllUploadedDuringSession((prev) => new Set([...prev, imageUrl]));
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      alert("이미지 업로드 실패");
    }
    event.target.value = "";
  };

  // 7. 태그 처리
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중이면 Enter 무시
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      const input = tagInput.trim();

      // #으로 시작하지 않으면 무시
      if (!input.startsWith("#")) return;

      // # 제거
      const cleanedTag = input.substring(1).trim();

      // 유효한 태그만 추가
      if (cleanedTag && !tags.includes(cleanedTag)) {
        setTags([...tags, cleanedTag]);
      }

      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      e.preventDefault();
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 8. 저장 핸들러
  const handleSave = async () => {
    if (!title.trim()) return alert("제목을 입력하세요.");

    const html = editor.getHTML();
    const currentImagesInEditor = extractImageUrls(html);
    const deletedImages = Array.from(allUploadedDuringSession)
      .filter((url) => !currentImagesInEditor.includes(url))
      .map((url) => url.split("/").pop() || url);

    const payload = {
      menuId: Number(queryMenuId || existingPost?.menuId),
      title,
      content: html,
      thumbnail: selectedThumbnail,
      tags, // 태그 추가
      deletedImages,
      published: true,
    };

    try {
      if (isEditMode) {
        await postUpdateMutation.mutateAsync({
          id: Number(postId),
          data: payload,
        });
      } else {
        await postSaveMutation.mutateAsync(payload);
      }
      alert("저장되었습니다!");
      navigate(-1);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* 상단 버튼 영역 */}
        <div className="flex justify-between items-center">
          <Button onClick={() => navigate(-1)} className="gap-2">
            뒤로가기
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              postSaveMutation.isPending || postUpdateMutation.isPending
            }
            className="gap-2"
          >
            {isEditMode ? "수정 완료" : "글 저장하기"}
          </Button>
        </div>

        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="p-2 w-full text-4xl font-extrabold bg-transparent border-none focus:outline-none text-card-foreground placeholder:text-muted-foreground"
        />

        {/* 이미지 파일 인풋 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUploadToServer}
        />

        {/* 에디터 영역 */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <Toolbar
            editor={editor}
            onImageClick={() => fileInputRef.current?.click()}
            isImagePending={imageMutation.isPending}
          />
          <EditorContent editor={editor} />
        </div>

        {/* 썸네일 선택 */}
        <ThumbnailSelector
          images={uploadedImages}
          selectedThumbnail={selectedThumbnail}
          onSelect={setSelectedThumbnail}
        />

        {/* 태그 입력 영역 */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center p-3 bg-card border border-border rounded-lg">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-medium px-3 py-1 gap-2"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={
                tags.length === 0 ? "#태그를 입력하고 Enter를 누르세요" : ""
              }
              className="flex-1 min-w-[200px] bg-transparent border-none focus:outline-none text-card-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
