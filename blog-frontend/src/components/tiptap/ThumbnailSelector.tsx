interface ThumbnailSelectorProps {
  images: string[];
  selectedThumbnail: string | null;
  onSelect: (url: string) => void;
}

export const ThumbnailSelector = ({ images, selectedThumbnail, onSelect }: ThumbnailSelectorProps) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-sm font-semibold mb-2">썸네일 선택</h3>
      <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
        {images.map((imageUrl, index) => {
          const isSelected = selectedThumbnail === imageUrl;

          return (
            <button
              key={`${imageUrl}-${index}`}
              type="button"
              onClick={() => onSelect(imageUrl)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                isSelected ? "border-black scale-105 z-10" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={imageUrl}
                alt={`Thumbnail ${index}`}
                className={`w-full h-full object-cover ${isSelected ? "opacity-100" : "opacity-70"}`}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150?text=Error";
                }}
              />
              {isSelected && (
                <div className="absolute top-1 right-1 bg-black text-white rounded-full p-0.5 shadow-md">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
