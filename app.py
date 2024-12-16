from pyspark.sql import SparkSession
from pyspark.sql.functions import col, explode, count, year, month, when
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
        .config("spark.driver.memory", "40g") \
        .config("spark.executor.memory", "50g") \
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
    # Explode countries and filter by the provided country
    query = df.select(explode(col("countries")).alias("country"))
    
    # Filter the exploded data for the specific country
    query = query.filter(col("country") == country)
    
    # Group by year and quartile, then count the articles in each quartile
    result = query.groupBy("year", "quartile") \
                  .count() \
                  .filter(col("quartile").isNotNull()) \
                  .orderBy("year", "quartile")
    
    # Collect the results and return them
    result = result.collect()

    # Prepare the final response
    response = []
    for row in result:
        year = row["year"]
        quartile = row["quartile"]
        count = row["count"]
        
        # Initialize the dictionary if not already present
        year_data = next((item for item in response if item["year"] == year), None)
        if not year_data:
            year_data = {"year": year, "Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0}
            response.append(year_data)
        
        # Assign the count to the corresponding quartile
        if quartile == "Q1":
            year_data["Q1"] = count
        elif quartile == "Q2":
            year_data["Q2"] = count
        elif quartile == "Q3":
            year_data["Q3"] = count
        elif quartile == "Q4":
            year_data["Q4"] = count

    return response



@app.get("/api/articles-per-quartile")
async def get_articles_per_quartile():
    # Group by quartile and count articles
    result = df.groupBy("quartile").agg(count("*").alias("article_count")).orderBy("article_count", ascending=False)
    
    # Format the result into a structured response
    quartiles = {}
    for row in result.collect():
        quartiles[row["quartile"]] = row["article_count"]
    
    # Ensure all quartiles are included, even if no data
    for quartile in ["Q1", "Q2", "Q3", "Q4"]:
        if quartile not in quartiles:
            quartiles[quartile] = 0

    return quartiles

