from pymongo import MongoClient
from gemini import init_model

# === CONFIGURATION ===
MONGO_URI = ("mongodb+srv://shakedamar1:rrkBElJ5jvxoEX3P@cluster0.eldkw5w."
             "mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB_NAME = "travel_data"
COLLECTION_NAME = "raw_text_entries"

# === Connect to MongoDB ===
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def get_city_entries(city_name):
    """
    Fetch all entries from the DB for the given city name.

    :param city_name: str - name of the city (e.g. 'Rome')
    :return: list of documents (as dicts)
    """
    genai = init_model()
    query = { "city": city_name }
    s = "what city is that? if not in this list return null"
    for c in query.values():
        s += " " + c
    city = genai.ask(s)
    if city == "null":
        return
    genai.ask("here some new places in " + city + ": \n" + get_city_text(city))

def get_city_text(city_name):

    results = collection.find({ "city": city_name })
    texts = [doc.get("text", "") for doc in results]
    return "\n".join(texts)