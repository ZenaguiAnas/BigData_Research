from pymongo import MongoClient
import json
import glob

client = MongoClient("mongodb+srv://bricoll:5dq3NdZvOYAxFYaJ@cluster0.xcxghap.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["scrapping"]  
collection = db["scrapping_data"] 

json_files = glob.glob("./data/*.json")

# print("json_files: ", json_files)

for file_path in json_files:
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)  
        if isinstance(data, list):
            result = collection.insert_many(data)
        else:
            result = collection.insert_one(data)
            # print(f"Inserted document ID: {result.inserted_id}")

print("JSON files inserted into MongoDB Atlas successfully.")
