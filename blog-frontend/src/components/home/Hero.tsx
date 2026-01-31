import type { ProfileResponse } from "../../axios/profile/profile";

interface HeroProps {
  hero?: ProfileResponse;
}

export function Hero({ hero }: HeroProps) {
  return (
    <section className="bg-card text-card-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-4 text-sm md:text-base">
            Blog
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6">
            {hero?.blogTitle || "Welcome to My Blog"}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-base md:text-lg">
            {hero?.blogDescription || "개발과 기술에 대한 이야기를 공유합니다."}
          </p>
        </div>
      </div>
    </section>
  );
}
