// import React, { useRef, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Link from "@tiptap/extension-link";
// import ImageResize from "tiptap-extension-resize-image";
// import TextAlign from "@tiptap/extension-text-align";
// import { useSearchParams, useNavigate } from "react-router-dom";

// import { useImageUpload, usePostSave } from "../../hooks/userPostSave";
// import { Button } from "../ui/button";
// import { Toolbar } from "./Toolbar";
// import { ThumbnailSelector } from "./ThumbnailSelector";

// interface TiptapEditorProps {
//   initialContent?: string;
//   initialTitle?: string;
//   menuId?: number;
// }

// export default function TiptapEditor({
//   initialContent = "",
//   initialTitle = "",
//   menuId: propsMenuId,
// }: TiptapEditorProps) {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // 1. [핵심] Menu ID 결정 (URL 쿼리 우선)
//   const queryMenuId = searchParams.get("menuId");
//   const finalMenuId = queryMenuId ? Number(queryMenuId) : propsMenuId;

//   // 2. 상태 관리
//   const [title, setTitle] = useState(initialTitle);
//   const [allUploadedDuringSession, setAllUploadedDuringSession] = useState<Set<string>>(new Set());
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

//   const imageMutation = useImageUpload();
//   const postSaveMutation = usePostSave();

//   // HTML에서 이미지 URL 추출 유틸리티
//   const extractImageUrls = (html: string): string[] => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, "text/html");
//     return Array.from(doc.querySelectorAll("img"))
//       .map((img) => img.getAttribute("src"))
//       .filter(Boolean) as string[];
//   };

//   // 3. 에디터 설정
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
//       Link.configure({ openOnClick: false }),
//       ImageResize,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],
//     content: initialContent,
//     onUpdate: ({ editor }) => {
//       const html = editor.getHTML();
//       const currentUrls = extractImageUrls(html);
//       setUploadedImages(currentUrls); // 썸네일 후보 목록 갱신

//       // 선택된 썸네일 유지 로직
//       setSelectedThumbnail((prev) => {
//         if (prev && currentUrls.includes(prev)) return prev;
//         return currentUrls.length > 0 ? currentUrls[0] : null;
//       });
//     },
//     editorProps: {
//       attributes: {
//         class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[60vh] max-w-none p-6",
//       },
//     },
//   });

//   if (!editor) return null;

//   // 4. 이미지 업로드 핸들러
//   const handleImageUploadToServer = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     try {
//       const imageUrl = await imageMutation.mutateAsync(file);
//       // 서버에서 준 URL을 세션 기록에 추가
//       setAllUploadedDuringSession((prev) => new Set([...prev, imageUrl]));
//       // 에디터에 삽입
//       editor.chain().focus().setImage({ src: imageUrl }).run();
//     } catch (error) {
//       alert("이미지 업로드 실패");
//     }
//     event.target.value = "";
//   };

//   // 5. 게시글 저장 핸들러
//   const handleSave = async () => {
//     if (!title.trim()) return alert("제목을 입력하세요.");
//     if (!finalMenuId) return alert("메뉴 정보가 없습니다.");

//     const html = editor.getHTML();
//     const currentImagesInEditor = extractImageUrls(html);

//     // [전략] 세션 중 업로드했지만 최종 본문엔 없는 이미지 = 삭제 대상
//     const deletedImages = Array.from(allUploadedDuringSession)
//       .filter((url) => !currentImagesInEditor.includes(url))
//       .map((url) => url.split("/").pop() || url); // 파일명만 추출해서 백엔드 전달

//     const payload = {
//       menuId: finalMenuId,
//       title,
//       content: html,
//       thumbnail: selectedThumbnail,
//       deletedImages,
//       published: true, // 저장 버튼을 누르면 공개로 가정
//     };

//     try {
//       await postSaveMutation.mutateAsync(payload);
//       alert("저장되었습니다!");
//       navigate(-1); // 이전 페이지로 복귀
//     } catch (error) {
//       alert("저장 중 오류가 발생했습니다.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-10">
//       <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4">
//         {/* 상단 액션바 */}
//         <div className="flex justify-between items-center mb-4">
//           <Button variant="ghost" onClick={() => navigate(-1)}>
//             뒤로가기
//           </Button>
//           <Button onClick={handleSave} disabled={postSaveMutation.isPending}>
//             {postSaveMutation.isPending ? "저장 중..." : "글 저장하기"}
//           </Button>
//         </div>

//         {/* 제목 입력 */}
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="제목을 입력하세요"
//           className="w-full text-4xl font-extrabold bg-transparent border-none focus:outline-none mb-4"
//         />

//         {/* 숨겨진 파일 인풋 */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleImageUploadToServer}
//         />

//         {/* 툴바 & 에디터 */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <Toolbar
//             editor={editor}
//             onImageClick={() => fileInputRef.current?.click()}
//             isImagePending={imageMutation.isPending}
//           />
//           <EditorContent editor={editor} />
//         </div>

//         {/* 썸네일 선택기 */}
//         <ThumbnailSelector
//           images={uploadedImages}
//           selectedThumbnail={selectedThumbnail}
//           onSelect={setSelectedThumbnail}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import TextAlign from "@tiptap/extension-text-align";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useImageUpload, usePostSave, usePostUpdate } from "../../hooks/userPostSave"; // usePostUpdate 추가 가정
import { usePostDetail } from "../../hooks/userGetPost"; // 상세조회 훅
import { Button } from "../ui/button";
import { Toolbar } from "./Toolbar";
import { ThumbnailSelector } from "./ThumbnailSelector";

export default function TiptapEditor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. URL 파라미터 추출
  const queryMenuId = searchParams.get("menuId");
  const postId = searchParams.get("postId"); // 수정 시 넘어오는 ID
  const isEditMode = !!postId;

  // 2. 상태 관리
  const [title, setTitle] = useState("");
  const [allUploadedDuringSession, setAllUploadedDuringSession] = useState<Set<string>>(new Set());
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  // 3. API 훅
  const { data: existingPost, isLoading: isPostLoading } = usePostDetail(postId ? Number(postId) : null);
  const imageMutation = useImageUpload();
  const postSaveMutation = usePostSave();
  const postUpdateMutation = usePostUpdate(); // 수정을 위한 Mutation 추가 필요

  const extractImageUrls = (html: string): string[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("img"))
      .map((img) => img.getAttribute("src"))
      .filter(Boolean) as string[];
  };

  // 4. 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
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
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[60vh] max-w-none p-6",
      },
    },
  });

  // 5. [중요] 수정 모드일 때 기존 데이터 세팅
  useEffect(() => {
    if (existingPost && editor) {
      setTitle(existingPost.title);
      editor.commands.setContent(existingPost.content); // 에디터 내용 주입
      setSelectedThumbnail(existingPost.thumbnail || null);

      // 기존 본문에 있던 이미지들도 세션 기록에 추가 (삭제 방지)
      const existingImages = extractImageUrls(existingPost.content);
      setAllUploadedDuringSession(new Set(existingImages));
      setUploadedImages(existingImages);
    }
  }, [existingPost, editor]);

  if (!editor || (isEditMode && isPostLoading)) {
    return <div className="flex justify-center py-20">데이터를 불러오는 중...</div>;
  }

  // 6. 이미지 업로드
  const handleImageUploadToServer = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // 7. 저장 핸들러 (생성/수정 분기)
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
      deletedImages,
      published: true,
    };

    try {
      if (isEditMode) {
        // 수정 요청
        await postUpdateMutation.mutateAsync({ id: Number(postId), data: payload });
      } else {
        // 생성 요청
        await postSaveMutation.mutateAsync(payload);
      }
      alert("저장되었습니다!");
      navigate(-1);
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            뒤로가기
          </Button>
          <Button onClick={handleSave} disabled={postSaveMutation.isPending || postUpdateMutation.isPending}>
            {isEditMode ? "수정 완료" : "글 저장하기"}
          </Button>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-4xl font-extrabold bg-transparent border-none focus:outline-none mb-4"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUploadToServer}
        />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Toolbar
            editor={editor}
            onImageClick={() => fileInputRef.current?.click()}
            isImagePending={imageMutation.isPending}
          />
          <EditorContent editor={editor} />
        </div>

        <ThumbnailSelector
          images={uploadedImages}
          selectedThumbnail={selectedThumbnail}
          onSelect={setSelectedThumbnail}
        />
      </div>
    </div>
  );
}
