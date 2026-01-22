from app import create_app, db
from app.models import Vehicle, User
from app.utils import get_postcode_coordinates
from datetime import datetime, date
from werkzeug.security import generate_password_hash

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating database tables...")
        db.drop_all()
        db.create_all()

        print("Adding test users...")
        users = []
        for i in range(51):
            user = User(
                email=f"test{i}@example.com",
                password=generate_password_hash("password123", method='pbkdf2:sha256')
            )
            db.session.add(user)
            users.append(user)
        
        db.session.commit()
        test_user = users[0]
        
        print("Adding sample vehicles...")
        
        vehicles = [
            {
                'user_id': test_user.id,
                'id': 1,
                'make': 'BMW',
                'model': '3 Series',
                'year': '2020',
                'price': 25000.00,
                'mileage': 30000,
                'fuel_type': 'Petrol',
                'transmission': 'Automatic',
                'body_type': 'Saloon',
                'colour': 'Black',
                'postcode': 'SE1 7PB',
                'images': [
                    {
                        'url': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': True,
                        'caption': 'BMW 3 Series - Main View'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': False,
                        'caption': 'BMW 3 Series - Interior'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1556800048-4ec2c7f4c4ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': False,
                        'caption': 'BMW 3 Series - Rear View'
                    }
                ],
                'owners': 3,
                'service_history': 'Full',
                'attention_grabber': 'This is an amazing car!',
                'description': 'fuioyqiuwjhekhfsliduchkjqhwef.....',
                'condition': 'Used',
                'dealer_name': 'Super cars',
                'dealer_rating': 4.8,
                'review_count': 1252,
                'engine_size': "1.6L",
                'power': "75hp",
                'mot_due': date(2025, 10, 31), 
            },
            {
                'user_id': test_user.id,
                'id': 2,
                'make': 'Audi',
                'model': 'A4',
                'year': '2019',
                'price': 22000.00,
                'mileage': 40000,
                'fuel_type': 'Diesel',
                'transmission': 'Automatic',
                'body_type': 'Saloon',
                'attention_grabber': 'Buy this now!',
                'description': '2.0 TDI S Line, Navigation Plus',
                'colour': 'Silver',
                'postcode': 'M1 1AD',
                'images': [
                    {
                        'url': 'https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': True,
                        'caption': 'Audi A4 - Main View'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': False,
                        'caption': 'Audi A4 - Interior'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': False,
                        'caption': 'Audi A4 - Side View'
                    }
                ],
                'owners': 3,
                'service_history': 'Full',
                'condition': 'Used',
                'dealer_name': 'Go Cars',
                'dealer_rating': 4.2,
                'review_count': 1252,
                'engine_size': "1.6L",
                'power': "75hp",
                'mot_due': date(2025, 3, 18), 
            },
            {
                'user_id': test_user.id,
                'id': 3,
                'make': 'Mercedes-Benz',
                'model': 'C-Class',
                'year': '2021',
                'price': 32000.00,
                'mileage': 15000,
                'fuel_type': 'Petrol',
                'transmission': 'Automatic',
                'body_type': 'Saloon',
                'colour': 'White',
                'postcode': 'B1 1AA',
                'description': 'C200 AMG Line Premium Plus',
                'images': [
                    {
                        'url': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': True,
                        'caption': 'Mercedes C-Class - Main View'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': False,
                        'caption': 'Mercedes C-Class - Interior'
                    },
                    {
                        'url': 'https://images.unsplash.com/photo-1563694983011-6f4ac67ff57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        'is_primary': False,
                        'caption': 'Mercedes C-Class - Side Profile'
                    }
                ],
                'owners': 3,
                'service_history': 'Full',
                'condition': 'Used',
                'dealer_name': 'Magic cars',
                'dealer_rating': 3.7,
                'review_count': 1252,
                'engine_size': "1.6L",
                'power': "75hp",
                'mot_due': date(2025, 8, 27), 
            },
        ]

        for vehicle in vehicles:
            coords = get_postcode_coordinates(vehicle['postcode'])
            if coords:
                vehicle['latitude'], vehicle['longitude'], vehicle['location'] = coords
            else:
                vehicle['latitude'] = 51.5074
                vehicle['longitude'] = -0.1278
                if 'location' not in vehicle:
                    vehicle['location'] = 'London'

        import random
        makes_models = [
            ('Ford', 'Focus'), ('Ford', 'Fiesta'), ('Ford', 'Mondeo'), ('Ford', 'Kuga'), ('Ford', 'Mustang'),
            ('Volkswagen', 'Golf'), ('Volkswagen', 'Polo'), ('Volkswagen', 'Passat'), ('Volkswagen', 'Tiguan'), ('Volkswagen', 'Beetle'),
            ('Toyota', 'Corolla'), ('Toyota', 'Camry'), ('Toyota', 'RAV4'), ('Toyota', 'Prius'), ('Toyota', 'Yaris'),
            ('Honda', 'Civic'), ('Honda', 'Accord'), ('Honda', 'CR-V'), ('Honda', 'Jazz'), ('Honda', 'HR-V'),
            ('Nissan', 'Qashqai'), ('Nissan', 'Juke'), ('Nissan', 'Micra'), ('Nissan', 'X-Trail'), ('Nissan', 'Leaf'),
            ('Peugeot', '208'), ('Peugeot', '308'), ('Peugeot', '3008'), ('Peugeot', '5008'), ('Peugeot', '2008'),
            ('Renault', 'Clio'), ('Renault', 'Megane'), ('Renault', 'Captur'), ('Renault', 'Kadjar'), ('Renault', 'Scenic'),
            ('Vauxhall', 'Corsa'), ('Vauxhall', 'Astra'), ('Vauxhall', 'Insignia'), ('Vauxhall', 'Mokka'), ('Vauxhall', 'Grandland'),
            ('Hyundai', 'i30'), ('Hyundai', 'Tucson'), ('Hyundai', 'i10'), ('Hyundai', 'i20'), ('Hyundai', 'Kona'),
            ('Kia', 'Sportage'), ('Kia', 'Ceed'), ('Kia', 'Picanto'), ('Kia', 'Niro'), ('Kia', 'Sorento')
        ]
        
        car_images = [
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ]
        
        fuel_types = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
        transmissions = ['Manual', 'Automatic']
        body_types = ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Coupe', 'Convertible']
        colours = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Yellow', 'Orange', 'Purple']

        location_postcodes = [
            ('SE1 7PB', 'London'),
            ('M1 1AD', 'Manchester'),
            ('B1 1AA', 'Birmingham'),
            ('LS1 1UR', 'Leeds'),
            ('G1 1AA', 'Glasgow'),
            ('S1 2JE', 'Sheffield'),
            ('BD1 1EE', 'Bradford'),
            ('L1 8JQ', 'Liverpool'),
            ('EH1 1YZ', 'Edinburgh'),
            ('BS1 4DJ', 'Bristol'),
            ('SW1A 1AA', 'London'),
            ('M2 5DB', 'Manchester'),
            ('B2 4QA', 'Birmingham'),
            ('LS2 7EX', 'Leeds'),
            ('G2 1DY', 'Glasgow'),
            ('S2 4SU', 'Sheffield'),
            ('L3 9AG', 'Liverpool'),
            ('EH2 2BD', 'Edinburgh'),
            ('BS2 0JA', 'Bristol'),
            ('NE1 4ST', 'Newcastle'),
            ('NG1 5FS', 'Nottingham'),
            ('CV1 1FH', 'Coventry'),
            ('LE1 5YA', 'Leicester'),
            ('SO14 2AJ', 'Southampton'),
            ('PL1 2AA', 'Plymouth'),
            ('CF10 1EP', 'Cardiff'),
            ('OX1 1DP', 'Oxford'),
            ('CB1 1PT', 'Cambridge'),
            ('BN1 1AL', 'Brighton'),
            ('BH1 1EB', 'Bournemouth'),
            ('NR1 1RE', 'Norwich'),
            ('IP1 1DJ', 'Ipswich'),
            ('CT1 1BE', 'Canterbury'),
            ('ME4 4UY', 'Chatham'),
            ('GU1 3UW', 'Guildford'),
            ('RG1 1AZ', 'Reading'),
            ('SL1 1DH', 'Slough'),
            ('LU1 2TL', 'Luton'),
            ('MK9 2FH', 'Milton Keynes'),
            ('NN1 1NS', 'Northampton'),
            ('PE1 1XA', 'Peterborough'),
            ('CB4 1RS', 'Cambridge'),
            ('HP1 1AA', 'Hemel Hempstead'),
            ('AL1 2RJ', 'St Albans'),
            ('WD17 1DY', 'Watford'),
            ('EN1 1YQ', 'Enfield'),
            ('RM1 3BD', 'Romford'),
            ('DA1 1DP', 'Dartford'),
            ('TN9 1SF', 'Tonbridge'),
            ('ME14 1XX', 'Maidstone'),
            ('TW9 1DX', 'Richmond'),
            ('KT1 1PE', 'Kingston'),
            ('CR0 1LP', 'Croydon'),
        ]
        conditions = ['New', 'Used', 'Nearly New']
        service_histories = ['Full', 'Partial', 'None']
        dealer_names = ['AutoMax', 'CarWorld', 'DriveTime', 'MotorHub', 'VehiclePlus', 'CarCenter', 'AutoDealer', 'CarSales']
        
        for i in range(50):
            make, model = random.choice(makes_models)
            user = random.choice(users)
            postcode, location = location_postcodes[i + 3]

            coords = get_postcode_coordinates(postcode)
            if coords:
                vehicle_lat, vehicle_lon, vehicle_location = coords
            else:
                print(f"Warning: Could not get coordinates for {postcode}")
                vehicle_lat = 51.5074
                vehicle_lon = -0.1278
                vehicle_location = location

            vehicle_data = {
                'user_id': user.id,
                'id': i + 4,
                'make': make,
                'model': model,
                'year': str(random.randint(2015, 2024)),
                'price': round(random.uniform(8000, 45000), 2),
                'mileage': random.randint(5000, 120000),
                'fuel_type': random.choice(fuel_types),
                'transmission': random.choice(transmissions),
                'body_type': random.choice(body_types),
                'colour': random.choice(colours),
                'location': vehicle_location,
                'postcode': postcode,
                'description': f'Excellent {make} {model} in great condition. Well maintained vehicle.',
                'latitude': vehicle_lat,
                'longitude': vehicle_lon,
                'images': [
                    {
                        'url': random.choice(car_images),
                        'is_primary': True,
                        'caption': f'{make} {model} - Exterior'
                    },
                    {
                        'url': random.choice(car_images),
                        'is_primary': False,
                        'caption': f'{make} {model} - Interior'
                    },
                    {
                        'url': random.choice(car_images),
                        'is_primary': False,
                        'caption': f'{make} {model} - Dashboard'
                    }
                ],
                'owners': random.randint(1, 5),
                'service_history': random.choice(service_histories),
                'attention_grabber': f'Amazing {make} {model} - Don\'t miss out!',
                'condition': random.choice(conditions),
                'dealer_name': random.choice(dealer_names),
                'dealer_rating': round(random.uniform(3.0, 5.0), 1),
                'review_count': random.randint(50, 2000),
                'engine_size': f"{random.choice(['1.0', '1.2', '1.4', '1.6', '1.8', '2.0', '2.5', '3.0'])}L",
                'power': f"{random.randint(70, 300)}hp",
                'mot_due': date(random.randint(2024, 2026), random.randint(1, 12), random.randint(1, 28)),
            }
            vehicles.append(vehicle_data)
        
        for vehicle_data in vehicles:
            vehicle = Vehicle(**vehicle_data)
            db.session.add(vehicle)
            print(f"Added vehicle: {vehicle.make} {vehicle.model}")
        
        try:
            db.session.commit()
            print("Database seeded successfully!")
            
            all_vehicles = Vehicle.query.all()
            print(f"Total vehicles in database: {len(all_vehicles)}")
            for v in all_vehicles:
                print(f"Vehicle: {v.make} {v.model}, Coords: {v.latitude}, {v.longitude}")
        except Exception as e:
            print(f"Error seeding database: {e}")
            db.session.rollback()
            
if __name__ == "__main__":
    seed_database()