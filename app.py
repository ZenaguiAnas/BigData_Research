from pyspark.sql import SparkSession
from pyspark.sql.functions import col, explode, count, array_contains
from fastapi import FastAPI, Query, HTTPException
from typing import List, Optional
import json

from fastapi.middleware.cors import CORSMiddleware

# FastAPI initialization
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SparkSession initialization with updated MongoDB configuration
spark = SparkSession.builder \
        .config("spark.jars.packages", "org.mongodb.spark:mongo-spark-connector_2.12:3.0.1") \
        .appName("My App") \
        .getOrCreate()

print("Loading the df : ")
# Load data from MongoDB Atlas
df = spark.read.format("com.mongodb.spark.sql.DefaultSource").option("uri", "mongodb+srv://bricoll:5dq3NdZvOYAxFYaJ@cluster0.xcxghap.mongodb.net/scrapping.new_collected_data?retryWrites=true&w=majority&appName=Cluster0").load()
df.cache()  # Cache for performance

print("-----------------------------------------------------------")
print(df)
print("-----------------------------------------------------------")


@app.get("/api/articles")
async def get_articles(
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    keywords: Optional[List[str]] = Query(None),
    authors: Optional[List[str]] = Query(None),
    universities: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
):
    query = df

    if year:
        query = query.filter(col("year") == year)
    if month:
        query = query.filter(col("month") == month)
    if keywords:
        query = query.filter(explode(col("keywords")).isin(keywords))
    if authors:
        query = query.filter(explode(col("authors")).isin(authors))
    if universities:
        query = query.filter(explode(col("universeties")).isin(universities))
    if countries:
        query = query.filter(explode(col("countries")).isin(countries))
    
    result = query.collect()
    return [row.asDict() for row in result]


@app.get("/api/articles/count-by-year")
async def count_articles_by_year():
    result = df.groupBy("year").agg(count("*").alias("article_count")).orderBy("year")
    return result.collect()


@app.get("/api/articles/count-by-month")
async def count_articles_by_month():
    result = df.groupBy("year", "month").agg(count("*").alias("article_count")).orderBy("year", "month")
    return result.collect()


@app.get("/api/articles/keywords")
async def get_articles_by_keywords():
    result = df.select(explode(col("keywords")).alias("keyword")).groupBy("keyword").count().orderBy("count", ascending=False)
    return result.collect()


@app.get("/api/articles/authors")
async def get_articles_by_authors():
    result = df.select(explode(col("authors")).alias("author")).groupBy("author").count().orderBy("count", ascending=False)
    return result.collect()


@app.get("/api/articles/universities")
async def get_articles_by_universities():
    result = df.select(explode(col("universeties")).alias("university")).groupBy("university").count().orderBy("count", ascending=False)
    return result.collect()


@app.get("/api/articles/countries")
async def get_articles_by_countries():
    result = df.select(explode(col("countries")).alias("country")).groupBy("country").count().orderBy("count", ascending=False)
    return result.collect()


@app.get("/api/articles/group-by-journal")
async def group_articles_by_journal():
    result = df.groupBy("journal").agg(count("*").alias("article_count")).orderBy("article_count", ascending=False)
    return result.collect()



@app.get("/countries")
async def get_countries():
    result = df.select(explode(col("countries")).alias("country")) \
              .distinct() \
              .orderBy("country")
    return [row["country"] for row in result.collect()]
  
  
@app.get("/api/articles/{country}")
async def get_articles_by_country(country: str):
    try:
        # Filter articles for the given country
        articles_by_country = df.filter(array_contains(col("countries"), country))

        # Group by year and pivot the 'quartile' column for Q1, Q2, Q3, Q4 counts
        articles_by_year_and_quartile = articles_by_country.groupBy("year") \
            .pivot("quartile", ["Q1", "Q2", "Q3", "Q4"]) \
            .agg(count("*").alias("count"))

        # Replace nulls with 0
        articles_by_year_and_quartile = articles_by_year_and_quartile.na.fill(0)

        # Convert to JSON format
        json_result = articles_by_year_and_quartile.toJSON().collect()
        result_list = [json.loads(row) for row in json_result]

        # Sort the results by year in descending order
        sorted_result = sorted(result_list, key=lambda x: x['year'], reverse=True)

        # Add missing keys with 0 if not present
        for item in sorted_result:
            item.setdefault("Q1", 0)
            item.setdefault("Q2", 0)
            item.setdefault("Q3", 0)
            item.setdefault("Q4", 0)

        return sorted_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/api/articles-per-quartile")
async def get_articles_per_quartile():
    try:
        # Group by quartile and count the number of articles
        number_of_articles_quartile = df.groupBy("quartile") \
            .agg(count("*").alias("article")) \
            .orderBy("article", ascending=False)

        # Convert the result to JSON
        json_result = number_of_articles_quartile.toJSON().collect()
        result_list = [json.loads(row) for row in json_result]

        return result_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")