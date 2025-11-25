import { Button } from "@/components/ui/button";

export const SimplifiedAbout = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          What is <span className="text-primary">TRN</span>?
        </h2>
        <p className="font-body text-lg md:text-xl text-foreground mb-3">
          <span className="text-primary font-bold">First meme coin backed by a real business.</span> Upload terrain photos, earn TRN tokens instantly. No speculation—just real work, real rewards.
        </p>
        <Button
          size="lg"
          className="font-display font-semibold mt-4"
          asChild
        >
          <a href="/earn-trn">
            🌱 Start Earning Now
          </a>
        </Button>
      </div>
    </section>
  );
};
