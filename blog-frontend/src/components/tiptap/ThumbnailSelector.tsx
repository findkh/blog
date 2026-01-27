import { Check } from "lucide-react";

interface ThumbnailSelectorProps {
  images: string[];
  selectedThumbnail: string | null;
  onSelect: (url: string) => void;
}

export function ThumbnailSelector({
  images,
  selectedThumbnail,
  onSelect,
}: ThumbnailSelectorProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-4 p-6 bg-card border border-border rounded-xl">
      <h3 className="text-xl font-bold text-card-foreground">썸네일 선택</h3>
      <p className="text-sm text-muted-foreground">
        글 목록에 표시될 대표 이미지를 선택하세요
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url) => (
          <button
            key={url}
            onClick={() => onSelect(url)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              selectedThumbnail === url
                ? "border-primary shadow-lg ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <img
              src={url}
              alt="썸네일 옵션"
              className="w-full h-full object-cover"
            />
            {selectedThumbnail === url && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="bg-primary rounded-full p-2">
                  <Check className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
