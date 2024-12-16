from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

uri = "mongodb+srv://bricoll:5dq3NdZvOYAxFYaJ@cluster0.xcxghap.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)

try:
    client.admin.command("ping")
    print("Connexion à MongoDB établie avec succès!")
except ConnectionFailure:
    print("Échec de la connexion à MongoDB.")