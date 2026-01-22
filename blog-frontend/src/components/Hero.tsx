export function Hero() {
  return (
    <section className="bg-card text-card-foreground py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-4 text-sm md:text-base">
            Blog
          </p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl mb-6">
            Discover our latest news
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-base md:text-lg">
            Discover the achievements that set us apart. From groundbreaking
            projects to industry accolades, we take pride in our
            accomplishments.
          </p>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* <img
              src="https://images.unsplash.com/photo-1644175897056-50f4d3a9a827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wZXIlMjBsZWdvJTIwY29kaW5nfGVufDF8fHx8MTc2OTA0MDY2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Web developer workspace with Lego"
              className="w-full h-auto object-cover"
            /> */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
