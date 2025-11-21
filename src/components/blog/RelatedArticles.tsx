import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

interface RelatedArticlesProps {
  articles: Article[];
}

export const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <section className="my-16">
      <h2 className="font-display text-3xl font-bold mb-8 text-center">
        Related <span className="text-primary">Articles</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <GlassCard key={article.slug} hover className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary">
                {article.category}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold mb-3 hover:text-primary transition-colors">
              {article.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {article.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {article.date}
              </div>
              <div>{article.readTime}</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow" asChild>
              <Link to={`/blog/${article.slug}`}>
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};
