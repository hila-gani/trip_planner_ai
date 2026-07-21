from pymongo import MongoClient
import json
import datetime

# === CONFIGURATION ===
MONGO_URI = ("mongodb+srv://shakedamar1:rrkBElJ5jvxoEX3P@cluster0.eldkw5w."
             "mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")  # or your cloud URI
DB_NAME = "travel_data"
COLLECTION_NAME = "raw_text_entries"

# === Connect to MongoDB ===
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# === Ask for city input ===
city = input("🌍 Enter the city this entry refers to: ").strip()

# === Ask for text input ===
print("✍️  Enter your travel-related text (type 'END' on a new line to finish):")
lines = []
while True:
    line = input()
    if line.strip().upper() == "END":
        break
    lines.append(line)

raw_text = "\n".join(lines)

# === Create JSON document ===
document = {
    "text": raw_text,
    "timestamp": datetime.datetime.now(timezone.utc),
    "city": city
}

# === Insert into MongoDB ===
result = collection.insert_one(document)
print(f"✅ Inserted into MongoDB with ID: {result.inserted_id}")
