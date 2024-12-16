from pymongo import MongoClient
import json
import glob
from bson import ObjectId

client = MongoClient("mongodb+srv://bricoll:5dq3NdZvOYAxFYaJ@cluster0.xcxghap.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["scrapping"]  
collection = db["new_collected_data"] 

json_files = glob.glob("./data/new_articles.json")

for file_path in json_files:
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)  
        for item in data:
            # Check if '_id' exists and is a string in ObjectId format, then convert it to ObjectId
            if '_id' in item and isinstance(item['_id'], dict) and '$oid' in item['_id']:
                item['_id'] = ObjectId(item['_id']['$oid'])
        
        # If the data is a list, insert many; otherwise, insert one
        if isinstance(data, list):
            result = collection.insert_many(data)
        else:
            result = collection.insert_one(data)

print("JSON files inserted into MongoDB Atlas successfully.")
