import requests
import math
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_postcode_coordinates(postcode: str):
    try:
        # Clean and format the postcode
        clean_postcode = postcode.strip().upper().replace(' ', '')
        if len(clean_postcode) >= 5:
            # Add space before last 3 characters for proper formatting
            formatted_postcode = clean_postcode[:-3] + ' ' + clean_postcode[-3:]
        else:
            formatted_postcode = clean_postcode
            
        print(f"Fetching coordinates for postcode: {formatted_postcode}")
        response = requests.get(f"https://api.postcodes.io/postcodes/{formatted_postcode}")
        
        if response.ok:
            data = response.json()['result']
            print(f"Successfully got coordinates for {formatted_postcode}")
            return data['latitude'], data['longitude'], data['parliamentary_constituency']
        else:
            print(f"Postcode API error: {response.status_code}, {response.text}")
            return None
    except Exception as e:
        print(f"Error fetching postcode data: {e}")
        return None

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 3959
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return round(R * c, 1)