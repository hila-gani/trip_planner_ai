import requests

def get_coordinates_osm(place_name):
    """
    Uses OpenStreetMap's Nominatim API to get coordinates for a place.
    :param place_name: str
    :return: (latitude, longitude) or None
    """
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": place_name,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "MyGeocodingApp/1.0 (your_email@example.com)"
    }

    response = requests.get(url, params=params, headers=headers)
    data = response.json()

    if data:
        lat = float(data[0]["lat"])
        lon = float(data[0]["lon"])
        return lat, lon
    else:
        print(f"❌ No coordinates found for {place_name}")
        return None
