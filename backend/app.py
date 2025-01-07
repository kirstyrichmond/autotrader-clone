# # app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# import requests
# import math
# from functools import lru_cache
# import os

# app = Flask(__name__)
# CORS(app)

# # Database setup
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///vehicles.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

# class Vehicle(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     make = db.Column(db.String(100), nullable=False)
#     model = db.Column(db.String(100), nullable=False)
#     year = db.Column(db.Integer, nullable=False)
#     price = db.Column(db.Float, nullable=False)
#     mileage = db.Column(db.Integer, nullable=False)
#     location = db.Column(db.String(100), nullable=False)
#     postcode = db.Column(db.String(10), nullable=False)
#     latitude = db.Column(db.Float, nullable=False)
#     longitude = db.Column(db.Float, nullable=False)
#     image_url = db.Column(db.String(500), nullable=False)

# @lru_cache(maxsize=1000)
# def get_postcode_coordinates(postcode: str) -> tuple[float, float] | None:
#     """Get coordinates for a postcode using postcodes.io with caching"""
#     try:
#         response = requests.get(f"https://api.postcodes.io/postcodes/{postcode}")
#         if response.ok:
#             data = response.json()['result']
#             return data['latitude'], data['longitude']
#         return None
#     except Exception as e:
#         print(f"Error fetching postcode data: {e}")
#         return None

# def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
#     """Calculate distance between two points in miles"""
#     R = 3959  # Earth's radius in miles
#     dlat = math.radians(lat2 - lat1)
#     dlon = math.radians(lon2 - lon1)
    
#     a = math.sin(dlat/2) * math.sin(dlat/2) + \
#         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
#         math.sin(dlon/2) * math.sin(dlon/2)
#     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
#     return round(R * c, 1)

# @app.route("/api/vehicles/search")
# def search_vehicles():
#     # Get search parameters
#     postcode = request.args.get('postcode')
#     radius = request.args.get('radius', type=int, default=50)
#     make = request.args.get('make')
#     model = request.args.get('model')
#     min_price = request.args.get('minPrice', type=float)
#     max_price = request.args.get('maxPrice', type=float)

#     # Start with base query
#     query = Vehicle.query

#     # Apply filters
#     if make:
#         query = query.filter_by(make=make)
#     if model:
#         query = query.filter_by(model=model)
#     if min_price:
#         query = query.filter(Vehicle.price >= min_price)
#     if max_price:
#         query = query.filter(Vehicle.price <= max_price)

#     # Get all matching vehicles
#     vehicles = query.all()
#     results = []

#     # If postcode provided, calculate distances and filter
#     if postcode:
#         coords = get_postcode_coordinates(postcode)
#         if not coords:
#             return jsonify({'error': 'Invalid postcode'}), 400

#         user_lat, user_lon = coords

#         # Calculate distance for each vehicle and filter by radius
#         for vehicle in vehicles:
#             distance = calculate_distance(
#                 user_lat, user_lon,
#                 vehicle.latitude, vehicle.longitude
#             )
            
#             if distance <= radius:
#                 results.append({
#                     'id': vehicle.id,
#                     'make': vehicle.make,
#                     'model': vehicle.model,
#                     'year': vehicle.year,
#                     'price': vehicle.price,
#                     'mileage': vehicle.mileage,
#                     'location': vehicle.location,
#                     'distance': distance,
#                     'image_url': vehicle.image_url
#                 })

#         # Sort by distance
#         results.sort(key=lambda x: x['distance'])
#     else:
#         # If no postcode, return all matching vehicles without distances
#         results = [{
#             'id': v.id,
#             'make': v.make,
#             'model': v.model,
#             'year': v.year,
#             'price': v.price,
#             'mileage': v.mileage,
#             'location': v.location,
#             'image_url': v.image_url
#         } for v in vehicles]

#     return jsonify({
#         'vehicles': results,
#         'total': len(results)
#     })

# # Helper route to get all makes
# @app.route("/api/makes")
# def get_makes():
#     makes = db.session.query(Vehicle.make).distinct().all()
#     return jsonify([make[0] for make in makes])

# # Helper route to get models for a make
# @app.route("/api/models")
# def get_models():
#     make = request.args.get('make')
#     if not make:
#         return jsonify({'error': 'Make parameter is required'}), 400
    
#     models = db.session.query(Vehicle.model).filter_by(make=make).distinct().all()
#     return jsonify([model[0] for model in models])

# if __name__ == "__main__":
#     with app.app_context():
#         db.create_all()
#     app.run(debug=True, port=5000)