'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from './charts/ChartContainer';
import ArticlesByYear from './charts/ArticlesByYear';
import ArticlesByKeywords from './charts/ArticlesByKeywords';
import ArticlesByJournal from './charts/ArticlesByJournal';
import ArticlesByCountry from './charts/ArticlesByCountry';
import MonthlyTrend from './charts/MonthlyTrend';
import FilteredArticlesView from './articles/FilteredArticlesView';

export default function ArticlesDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-4xl font-bold">Research Articles Analytics</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartContainer title="Articles Published by Year">
              <ArticlesByYear />
            </ChartContainer>
            <ChartContainer title="Monthly Publication Trend">
              <MonthlyTrend />
            </ChartContainer>
            <ChartContainer title="Top Journals">
              <ArticlesByJournal />
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <FilteredArticlesView />
        </TabsContent>

        <TabsContent value="topics">
          <ChartContainer title="Research Keywords Distribution">
            <ArticlesByKeywords />
          </ChartContainer>
        </TabsContent>

        <TabsContent value="geography">
          <ChartContainer title="Geographical Distribution of Research">
            <ArticlesByCountry />
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}