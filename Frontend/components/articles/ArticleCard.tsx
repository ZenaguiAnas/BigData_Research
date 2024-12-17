'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, MapPin, Calendar } from 'lucide-react';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">{article.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {article.journal}
            </span>
            <span className="mx-2">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {article.month} {article.year}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.keywords.map((keyword) => (
            <Badge key={keyword} variant="secondary">
              {keyword}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 mt-1 shrink-0" />
            <p className="text-sm">
              {article.authors.join(', ')}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 shrink-0" />
            <p className="text-sm">
              {article.universeties.join('; ')}
            </p>
          </div>
        </div>

        {article.doi && (
          <div className="pt-2">
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              DOI: {article.doi}
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}