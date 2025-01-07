from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from .models import Vehicle, User
from . import db
from app.utils import get_postcode_coordinates, calculate_distance
from datetime import datetime, timezone
import json
import os

api = Blueprint('api', __name__)

# Auth Routes
@api.route("/auth/register", methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    print(f"Register attempt - Email: {email}")
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'Email already exists'}), 400
        
    try:
        password_hash = generate_password_hash(password, method='pbkdf2:sha256')
        print(f"Generated hash during registration: {password_hash}")
        
        new_user = User(
            email=email,
            password=password_hash
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration successful',
            'user': {'id': new_user.id, 'email': new_user.email}
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@api.route("/auth/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    print(f"Login attempt - Email: {email}")
    
    user = User.query.filter_by(email=email).first()
    print(f"User found: {user is not None}")
    print(f"User ID: {user.id if user else None}")  # Add this debug line
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 400
    
    try:
        if check_password_hash(user.password, password):
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,  # Make sure id is included
                    'email': user.email
                }
            }), 200
        else:
            print("Password check failed")
            return jsonify({'error': 'Invalid credentials'}), 400
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Vehicle Routes
@api.route("/vehicles", methods=['GET'])
def get_vehicles():
    try:
        vehicles = Vehicle.query.filter_by(status='active').all()
        return jsonify([{
            'user_id': v.user_id,
            'id': v.id,
            'make': v.make,
            'model': v.model,
            'year': v.year,
            'price': v.price,
            'mileage': v.mileage,
            'fuel_type': v.fuel_type,
            'transmission': v.transmission,
            'body_type': v.body_type,
            'colour': v.colour,
            'location': v.location,
            'postcode': v.postcode,
            'latitude': v.latitude,
            'longitude': v.longitude,
            'power': v.power,
            'owners': v.owners,
            'service_history': v.service_history,
            'attention_grabber': v.attention_grabber,
            'condition': v.condition,
            'dealer_name': v.dealer_name,
            'dealer_rating': v.dealer_rating,
            'review_count': v.review_count,
            'engine_size': v.engine_size,
            'description': v.description,
            'images': v.images,
            'created_at': v.created_at.isoformat() if v.created_at else None,
            'updated_at': v.updated_at.isoformat() if v.updated_at else None
        } for v in vehicles])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/vehicles/<int:vehicle_id>", methods=['GET'])
def get_vehicle(vehicle_id):
    try:
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
            
        return jsonify({
            'id': vehicle.id,
            'user_id': vehicle.user_id,
            'make': vehicle.make,
            'model': vehicle.model,
            'year': vehicle.year,
            'price': vehicle.price,
            'mileage': vehicle.mileage,
            'fuel_type': vehicle.fuel_type,
            'transmission': vehicle.transmission,
            'body_type': vehicle.body_type,
            'colour': vehicle.colour,
            'location': vehicle.location,
            'postcode': vehicle.postcode,
            'latitude': vehicle.latitude,
            'longitude': vehicle.longitude,
            'power': vehicle.power,
            'owners': vehicle.owners,
            'service_history': vehicle.service_history,
            'attention_grabber': vehicle.attention_grabber,
            'condition': vehicle.condition,
            'dealer_name': vehicle.dealer_name,
            'dealer_rating': vehicle.dealer_rating,
            'review_count': vehicle.review_count,
            'engine_size': vehicle.engine_size,
            'description': vehicle.description,
            'mot_due': vehicle.mot_due,
            'images': vehicle.images,
            'created_at': vehicle.created_at.isoformat() if vehicle.created_at else None,
            'updated_at': vehicle.updated_at.isoformat() if vehicle.updated_at else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/vehicles', methods=['POST'])
def create_vehicle():
    try:
        data = request.json
        print("Received data:", data)

        # if 'user_id' not in data:
        #     return jsonify({"error": "user_id is required"}), 400

        # Get coordinates from postcode
        coords = get_postcode_coordinates(data['postcode'])
        vehicle_lat, vehicle_lon, vehicle_location = coords

        # Transform images
        transformed_images = []
        if data.get('images'):
            for index, img in enumerate(data['images']):
                transformed_images.append({
                    'preview': img.get('url', ''),
                    'url': img.get('url', ''),
                    'caption': 'Car image',
                    'is_primary': index == 0
                })

        # Create new vehicle with the provided user_id
        new_vehicle = Vehicle(
            user_id=data['user_id'],  # Use the provided user_id
            make=data['make'],
            model=data['model'],
            year=data['year'],
            price=data['price'],
            mileage=data['mileage'],
            fuel_type=data['fuel_type'],
            body_type=data['body_type'],
            transmission=data['transmission'],
            colour=data.get('colour'),
            location=vehicle_location,
            postcode=data['postcode'],
            latitude=vehicle_lat,
            longitude=vehicle_lon,
            power=data['power'],
            owners=data['owners'],
            service_history=data['service_history'],
            attention_grabber=data['attention_grabber'],
            condition=data['condition'],
            dealer_name=data.get('dealer_name'),
            dealer_rating=data.get('dealer_rating', 0),
            review_count=data.get('review_count', 0),
            engine_size=data['engine_size'],
            description=data['description'],
            mot_due=data['mot_due'],
            images=transformed_images,
            status='active',
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        
        db.session.add(new_vehicle)
        db.session.commit()
        
        return jsonify({
            "id": new_vehicle.id,
            "message": "Vehicle created successfully"
        }), 201
        
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@api.route("/vehicles/user/<int:user_id>", methods=['GET'])
def get_user_vehicles(user_id):
    try:
        vehicles = Vehicle.query.filter_by(user_id=user_id).all()
        print(f"Vehicles for user_id {user_id}: {vehicles}")

        return jsonify([{
            'id': v.id,
            'make': v.make,
            'model': v.model,
            'year': v.year,
            'price': v.price,
            'mileage': v.mileage,
            'status': v.status,
            'created_at': v.created_at.isoformat() if v.created_at else None,
            'attention_grabber': v.attention_grabber,
            'images': v.images
        } for v in vehicles])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/vehicles/<int:vehicle_id>", methods=['DELETE'])
def delete_vehicle(vehicle_id):
    try:
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404
            
        db.session.delete(vehicle)
        db.session.commit()
        
        return jsonify({'message': 'Vehicle deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route("/vehicles/<int:vehicle_id>", methods=['PUT'])
def update_vehicle(vehicle_id):
    try:
        vehicle = Vehicle.query.get(vehicle_id)
        if not vehicle:
            return jsonify({'error': 'Vehicle not found'}), 404

        data = request.json
        
        # Update coordinates if postcode changed
        if data.get('postcode') and data['postcode'] != vehicle.postcode:
            coords = get_postcode_coordinates(data['postcode'])
            vehicle_lat, vehicle_lon, vehicle_location = coords
            vehicle.latitude = vehicle_lat
            vehicle.longitude = vehicle_lon
            vehicle.location = vehicle_location

        # Update fields
        for key, value in data.items():
            if hasattr(vehicle, key):
                setattr(vehicle, key, value)
        
        vehicle.updated_at = datetime.now(tz=timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'Vehicle updated successfully',
            'vehicle': {
                'id': vehicle.id,
                'make': vehicle.make,
                'model': vehicle.model
                # Add other fields as needed
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route("/vehicles/search")
def search_vehicles():
    postcode = request.args.get('postcode')
    radius = request.args.get('radius', type=int, default=50)
    
    print(f"Searching with postcode: {postcode}, radius: {radius}")
    
    # Only get active listings
    all_vehicles = Vehicle.query.filter_by(status='active').all()
    print(f"Total vehicles in database: {len(all_vehicles)}")
    
    if postcode:
        coords = get_postcode_coordinates(postcode)
        print(f"Coordinates for {postcode}: {coords}")
        
        if not coords:
            return jsonify({'error': 'Invalid postcode'}), 400
            
        user_lat, user_lon, user_location = coords
        results = []
        
        for vehicle in all_vehicles:
            print(f"Checking vehicle: {vehicle.make} {vehicle.model}")
            print(f"Vehicle coords: {vehicle.latitude}, {vehicle.longitude}")
            
            distance = calculate_distance(
                user_lat, user_lon,
                vehicle.latitude, vehicle.longitude
            )
            print(f"Distance to vehicle: {distance} miles")
            
            if distance <= radius:
                results.append({
                    'id': vehicle.id,
                    'user_id': vehicle.user_id,
                    'make': vehicle.make,
                    'model': vehicle.model,
                    'price': vehicle.price,
                    'year': vehicle.year,
                    'body_type': vehicle.body_type,
                    'mileage': vehicle.mileage,
                    'transmission': vehicle.transmission,
                    'fuel_type': vehicle.fuel_type,
                    'owners': vehicle.owners,
                    'service_history': vehicle.service_history,
                    'attention_grabber': vehicle.attention_grabber,
                    'condition': vehicle.condition,
                    'images': vehicle.images,
                    'dealer_name': vehicle.dealer_name,
                    'dealer_rating': vehicle.dealer_rating,
                    'review_count': vehicle.review_count,
                    'location': vehicle.location,
                    'engine_size': vehicle.engine_size,
                    'power': vehicle.power,
                    'postcode': vehicle.postcode,
                    'distance': distance
                })
    
        return jsonify({
            'vehicles': results,
            'total': len(results)
        })