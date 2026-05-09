import datetime

from gemini import init_model
from flask import Flask, request, jsonify
from flask_cors import CORS
import rag
import json

app = Flask(__name__)

CORS(app)


def generate_trip_prompt_from_json(trip_form: dict) -> str:
    destination = trip_form.get("destination", "a destination")
    # destination = rag.get_city_entries(destination)
    start_date = trip_form.get("startDate", "a start date")
    end_date = trip_form.get("endDate", "an end date")
    number_of_people = trip_form.get("totalPeople", "some")
    people_type = trip_form.get("ageGroups", "travelers")
    budget = trip_form.get("budget", "a flexible budget")
    trip_type = trip_form.get("tripStyles", "a general trip")
    additional_requests = trip_form.get("additionalRequests", "")

    prompt = f"""
    You are a travel planner AI. Given the following trip details, generate a trip itinerary in JSON format.

    The format MUST match the structure below:
    TripItinerary {{
destination: string,
startDate: string (in "MMM dd, YYYY" format, e.g. "Jul 10, 2025"),
endDate: string (same format),
totalDays: number,
totalPeople: number,
dailyBudget: number,
coordinates: {{
lat: number,
lng: number
}},
accommodation: {{
name: string,
type: string,
description: string,
coordinates: {{
lat: number,
lng: number
}}
}},
days: [
{{
date: string (in "MMM dd, YYYY" format),
title: string,
description: string,
activities: [
{{
time: string (e.g. "09:00 AM"),
title: string,
description: string,
duration?: string,
location?: string,
coordinates?: {{
lat: number,
lng: number
}}
}},
...
]
}},
...
]
}}
    Trip details:
    Destination: {destination}
    Start date: {start_date}
    End date: {end_date}
    Traveler count: {number_of_people}
    Traveler type: {people_type}
    Budget: {budget}
    Trip style: {trip_type}
    {f"Additional requests: {additional_requests}" if additional_requests else ""}

    Only return the JSON. Do not include any additional explanation or comments. esspecialy without the word 'json' in the start.""".strip()

    return prompt


def strip_junk_before_json(s: str) -> str:
    start = s.find('{')
    end = s.rfind('}')

    if start == -1 or end == -1 or end <= start:
        raise ValueError("Could not find a valid JSON object in the string")

    return s[start:end+1]

@app.route('/submit', methods=['POST'])
def ask_for_trip():
    if not request.is_json:
        return "Request must be JSON", 400

    trip_form = request.json  # Use get_json() for JSON payloads
    print(trip_form)
    # Input validation (important for production)
    # required_fields = ['country', 'start_date', 'end_date', 'number_of_people',
    #                    'people_type', 'budget', 'trip_type']
    # for field in required_fields:
    #     if field not in trip_form:
    #         return f"Missing field: {field}", 400
    prompt = generate_trip_prompt_from_json(trip_form)
    prompt = prompt.strip()
    print(prompt)
    # prompt = create_trip_prompt(trip_form)
    gemini_model = init_model("gemini-1.5-flash")
    response: str = gemini_model.ask(prompt)
    response = strip_junk_before_json(response)
    print(response)
    try:
        # Convert AI response string to a real dict
        itinerary_dict: dict = json.loads(response)
    except json.JSONDecodeError as e:
        print("❌ JSONDecodeError:", e)
        print("🔎 Raw response string:\n", repr(response))
        return "AI returned invalid JSON", 500

    return jsonify(itinerary_dict)

# json_string = '''
# [
#   {
#     "date": "2025-06-05",
#     "activities": [
#       {
#         "title": "Arrive in Munich and Settle In",
#         "description": "Arrive at Munich Airport (MUC)..."
#       },
#       {
#         "title": "Evening Stroll in English Garden",
#         "description": "Take a leisurely walk..."
#       }
#     ]
#   },
#   {
#     "date": "2025-06-06",
#     "activities": [
#       {
#         "title": "Morning at Marienplatz and Viktualienmarkt",
#         "description": "Explore Marienplatz..."
#       },
#       {
#         "title": "Relaxed Evening at a Traditional Beer Garden",
#         "description": "Experience authentic Bavarian culture..."
#       }
#     ]
#   }
# ]
# '''

# itinerary = json.loads(json_string)
#
# for day in itinerary:
#     print(f"Date: {day['date']}")
#     print("Activities:")
#
#     for activity in day['activities']:
#         print(f"  - {activity['title']}")
#         print(f"    Description: {activity['description']}")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
