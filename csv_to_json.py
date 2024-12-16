import csv
import json

input_csv_file = "./data/articles_blockchain.csv"
output_json_file = "./data/articles_blockchain.json"

def csv_to_json(csv_file, json_file):
    with open(csv_file, mode='r', encoding='utf-8') as csvfile:
        csv_reader = csv.DictReader(csvfile)
        articles = [row for row in csv_reader] 

    with open(json_file, mode='w', encoding='utf-8') as jsonfile:
        json.dump(articles, jsonfile, ensure_ascii=False,indent=4)  

csv_to_json(input_csv_file, output_json_file)

print(f"Data has been converted from {input_csv_file} to {output_json_file}")
