from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from .models import Chat, Vehicle, User, Message
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
    print(f"User ID: {user.id if user else None}")
    
    if not user:
        return jsonify({'error': 'Email or password is incorrect'}), 400
    
    try:
        if check_password_hash(user.password, password):
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
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
            user_id=data['user_id'],
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
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route("/vehicles/search")
def search_vehicles():
    postcode = request.args.get('postcode')
    radius_param = request.args.get('radius', default='50')
    radius = radius_param if radius_param == 'NATIONAL' else int(radius_param)
    make = request.args.get('make')
    model = request.args.get('model')
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    min_year = request.args.get('minYear', type=int)
    max_year = request.args.get('maxYear', type=int)
    min_mileage = request.args.get('minMileage', type=int)
    max_mileage = request.args.get('maxMileage', type=int)
    transmission = request.args.get('transmission')
    fuel_type = request.args.get('fuelType')
    body_type = request.args.get('bodyType')
    sort_by = request.args.get('sortBy', default='relevance')
    page = request.args.get('page', type=int, default=1)
    per_page = request.args.get('perPage', type=int, default=1000)
    
    query = Vehicle.query.filter_by(status='active')
    
    if make:
        query = query.filter(Vehicle.make.ilike(f'%{make}%'))
    if model:
        query = query.filter(Vehicle.model.ilike(f'%{model}%'))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    if min_year:
        query = query.filter(Vehicle.year >= min_year)
    if max_year:
        query = query.filter(Vehicle.year <= max_year)
    if min_mileage is not None:
        query = query.filter(Vehicle.mileage >= min_mileage)
    if max_mileage is not None:
        query = query.filter(Vehicle.mileage <= max_mileage)
    if transmission:
        transmission_list = transmission.split(',')
        query = query.filter(Vehicle.transmission.in_(transmission_list))
    if fuel_type:
        fuel_type_list = fuel_type.split(',')
        query = query.filter(Vehicle.fuel_type.in_(fuel_type_list))
    if body_type:
        query = query.filter(Vehicle.body_type == body_type)
    
    if postcode:
        coords = get_postcode_coordinates(postcode)
        if not coords:
            return jsonify({'error': 'Invalid postcode'}), 400
            
        user_lat, user_lon, user_location = coords
        
        vehicles = query.all()
        results = []
        
        for vehicle in vehicles:
            distance = calculate_distance(
                user_lat, user_lon,
                vehicle.latitude, vehicle.longitude
            )

            if radius == 'NATIONAL' or distance <= radius:
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
                    'distance': round(distance, 1)
                })
        
        if sort_by == 'price_asc':
            results.sort(key=lambda x: x['price'])
        elif sort_by == 'price_desc':
            results.sort(key=lambda x: x['price'], reverse=True)
        elif sort_by == 'distance':
            results.sort(key=lambda x: x['distance'])
        elif sort_by == 'mileage':
            results.sort(key=lambda x: x['mileage'])
        elif sort_by == 'year_desc':
            results.sort(key=lambda x: int(x['year']), reverse=True)
        elif sort_by == 'year_asc':
            results.sort(key=lambda x: int(x['year']))
        elif sort_by == 'recent':
            results.sort(key=lambda x: x['id'], reverse=True)
        else:
            results.sort(key=lambda x: x['distance'])

        start = (page - 1) * per_page
        end = start + per_page
        paginated_results = results[start:end]
        
        return jsonify({
            'vehicles': paginated_results,
            'total': len(results),
            'page': page,
            'per_page': per_page,
            'total_pages': (len(results) + per_page - 1) // per_page
        })
    
    if sort_by == 'price_asc':
        query = query.order_by(Vehicle.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Vehicle.price.desc())
    elif sort_by == 'mileage':
        query = query.order_by(Vehicle.mileage.asc())
    elif sort_by == 'year_desc':
        query = query.order_by(Vehicle.year.desc())
    elif sort_by == 'year_asc':
        query = query.order_by(Vehicle.year.asc())
    elif sort_by == 'recent':
        query = query.order_by(Vehicle.id.desc())
    else:
        query = query.order_by(Vehicle.id.desc())

    total = query.count()
    vehicles = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'vehicles': [{
            'id': v.id,
            'user_id': v.user_id,
            'make': v.make,
            'model': v.model,
            'price': v.price,
            'year': v.year,
            'body_type': v.body_type,
            'mileage': v.mileage,
            'transmission': v.transmission,
            'fuel_type': v.fuel_type,
            'owners': v.owners,
            'service_history': v.service_history,
            'attention_grabber': v.attention_grabber,
            'condition': v.condition,
            'images': v.images,
            'dealer_name': v.dealer_name,
            'dealer_rating': v.dealer_rating,
            'review_count': v.review_count,
            'location': v.location,
            'engine_size': v.engine_size,
            'power': v.power,
            'postcode': v.postcode,
        } for v in vehicles.items],
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    })

# Favorites Routes
@api.route("/favorites/<int:user_id>", methods=['GET'])
def get_favorites(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        favorite_vehicles = user.favorite_vehicles.all()
        return jsonify([{
            'id': v.id,
            'user_id': v.user_id,
            'make': v.make,
            'model': v.model,
            'price': v.price,
            'year': v.year,
            'mileage': v.mileage,
            'body_type': v.body_type,
            'transmission': v.transmission,
            'fuel_type': v.fuel_type,
            'owners': v.owners,
            'service_history': v.service_history,
            'attention_grabber': v.attention_grabber,
            'condition': v.condition,
            'images': v.images,
            'dealer_name': v.dealer_name,
            'dealer_rating': v.dealer_rating,
            'review_count': v.review_count,
            'location': v.location,
            'engine_size': v.engine_size,
            'power': v.power,
            'postcode': v.postcode,
        } for v in favorite_vehicles])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/favorites/<int:user_id>/<int:vehicle_id>", methods=['POST'])
def add_favorite(user_id, vehicle_id):
    try:
        user = User.query.get(user_id)
        vehicle = Vehicle.query.get(vehicle_id)

        print(f"Found user: {user is not None}, Found vehicle: {vehicle is not None}")
        
        if not user or not vehicle:
            return jsonify({'error': 'User or vehicle not found'}), 404
            
        if vehicle.user_id == user_id:
            return jsonify({'error': 'Cannot favorite your own vehicle'}), 400
        
        if vehicle in user.favorite_vehicles:
            return jsonify({
                'success': True,
                'message': 'Vehicle is already in favorites'
            }), 200
            
        user.favorite_vehicles.append(vehicle)
        db.session.commit()
            
        return jsonify({
            'success': True,
            'message': 'Vehicle added to favorites',
            'vehicle': {
                'id': vehicle.id,
                'user_id': vehicle.user_id,
                'make': vehicle.make,
                'model': vehicle.model,
                'price': vehicle.price,
                'year': vehicle.year,
                'mileage': vehicle.mileage,
                'body_type': vehicle.body_type,
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
            }
        }), 200
            
    except Exception as e:
        db.session.rollback()
        print(f"Error adding favorite: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route("/favorites/<int:user_id>/<int:vehicle_id>", methods=['DELETE'])
def remove_favorite(user_id, vehicle_id):
    try:
        user = User.query.get(user_id)
        vehicle = Vehicle.query.get(vehicle_id)
        
        if not user or not vehicle:
            return jsonify({'error': 'User or vehicle not found'}), 404
            
        if vehicle in user.favorite_vehicles:
            user.favorite_vehicles.remove(vehicle)
            db.session.commit()
            
        return jsonify({
            'success': True,
            'message': 'Vehicle removed from favorites',
            'vehicle': {
                'id': vehicle.id,
                'user_id': vehicle.user_id,
                'make': vehicle.make,
                'model': vehicle.model,
                'price': vehicle.price,
                'year': vehicle.year,
                'mileage': vehicle.mileage,
                'body_type': vehicle.body_type,
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
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
# Chat Routes
@api.route("/chats", methods=['GET'])
def get_user_chats():
    user_id = request.args.get('user_id', type=int)
    chats = Chat.query.filter(
        db.or_(Chat.buyer_id == user_id, Chat.seller_id == user_id)
    ).order_by(Chat.last_message_at.desc()).all()
    
    return jsonify([{
        'id': chat.id,
        'listing': {
            'id': chat.listing.id,
            'make': chat.listing.make,
            'model': chat.listing.model,
            'images': chat.listing.images
        },
        'buyer': {
            'id': chat.buyer.id,
            'email': chat.buyer.email
        },
        'seller': {
            'id': chat.seller.id,
            'email': chat.seller.email
        },
        'last_message_at': chat.last_message_at.isoformat(),
        'messages': [{
            'id': msg.id,
            'sender_id': msg.sender_id,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
            'read_at': msg.read_at.isoformat() if msg.read_at else None
        } for msg in chat.messages]
    } for chat in chats])

@api.route("/chats", methods=['POST'])
def create_chat():
    try:
        data = request.json
        listing_id = data.get('listing_id')
        buyer_id = data.get('buyer_id')
        seller_id = data.get('seller_id')

        # Check if chat already exists
        existing_chat = Chat.query.filter_by(
            listing_id=listing_id,
            buyer_id=buyer_id,
            seller_id=seller_id
        ).first()

        if existing_chat:
            return jsonify({
                'id': existing_chat.id,
                'message': 'Chat already exists'
            }), 200

        # Create new chat
        new_chat = Chat(
            listing_id=listing_id,
            buyer_id=buyer_id,
            seller_id=seller_id,
            created_at=datetime.now(tz=timezone.utc),
            last_message_at=datetime.now(tz=timezone.utc)
        )
        
        db.session.add(new_chat)
        db.session.commit()

        return jsonify({
            'id': new_chat.id,
            'message': 'Chat created successfully'
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating chat: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@api.route("/chats/<int:chat_id>", methods=['GET'])
def get_chat(chat_id):
    chat = Chat.query.get(chat_id)
    if not chat:
        return jsonify({'error': 'Chat not found'}), 404
        
    return jsonify({
        'id': chat.id,
        'listing': {
            'id': chat.listing.id,
            'make': chat.listing.make,
            'model': chat.listing.model,
            'images': chat.listing.images
        },
        'buyer': {
            'id': chat.buyer.id,
            'email': chat.buyer.email
        },
        'seller': {
            'id': chat.seller.id,
            'email': chat.seller.email
        },
        'last_message_at': chat.last_message_at.isoformat(),
        'messages': [{
            'id': msg.id,
            'sender_id': msg.sender_id,
            'content': msg.content,
            'created_at': msg.created_at.isoformat(),
            'read_at': msg.read_at.isoformat() if msg.read_at else None
        } for msg in chat.messages]
    })

@api.route("/chats/<int:chat_id>/messages", methods=['GET'])
def get_chat_messages(chat_id):
    messages = Message.query.filter_by(chat_id=chat_id).order_by(Message.created_at).all()
    return jsonify([{
        'id': msg.id,
        'sender_id': msg.sender_id,
        'content': msg.content,
        'created_at': msg.created_at.isoformat(),
        'read_at': msg.read_at.isoformat() if msg.read_at else None
    } for msg in messages])

@api.route("/chats/<int:chat_id>/messages", methods=['POST'])
def send_message(chat_id):
    data = request.json
    message = Message(
        chat_id=chat_id,
        sender_id=data['sender_id'],
        content=data['content']
    )
    db.session.add(message)
    
    # Update chat's last_message_at
    chat = Chat.query.get(chat_id)
    chat.last_message_at = datetime.now(tz=timezone.utc)
    
    db.session.commit()
    return jsonify({
        'id': message.id,
        'sender_id': message.sender_id,
        'content': message.content,
        'created_at': message.created_at.isoformat()
    })

# Notificaion Routes
@api.route("/messages/unread-count/<int:user_id>", methods=['GET'])
def get_unread_count(user_id):
    try:
        # Count unread messages where user is recipient
        unread_count = Message.query.join(Chat).filter(
            db.or_(
                db.and_(Chat.buyer_id == user_id, Message.sender_id != user_id),
                db.and_(Chat.seller_id == user_id, Message.sender_id != user_id)
            ),
            Message.read_at.is_(None)
        ).count()
        
        return jsonify({'unread_count': unread_count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route("/messages/mark-read", methods=['POST'])
def mark_messages_read():
    try:
        data = request.json
        chat_id = data.get('chat_id')
        user_id = data.get('user_id')
        
        # Mark all messages in chat as read for this user
        messages = Message.query.filter(
            Message.chat_id == chat_id,
            Message.sender_id != user_id,
            Message.read_at.is_(None)
        ).all()
        
        now = datetime.now(tz=timezone.utc)
        for message in messages:
            message.read_at = now
            
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500