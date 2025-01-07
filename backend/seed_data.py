from app import create_app, db
from app.models import Vehicle, User
from datetime import datetime, date
from werkzeug.security import generate_password_hash

def seed_database():
    app = create_app()
    with app.app_context():
        print("Creating database tables...")  # Debug log
        db.drop_all()
        db.create_all()

        print("Adding test user...")
        # Create a test user first
        test_user = User(
            email="test@example.com",
            password=generate_password_hash("password123", method='pbkdf2:sha256')
        )
        db.session.add(test_user)
        db.session.commit()
        
        print("Adding sample vehicles...")  # Debug log
        
        # Sample vehicle data
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
                'location': 'London',
                'postcode': 'SE17PB',
                'description': '320i M Sport, Full Service History',
                # 'vehicle_image_url': '',
                # Add default coordinates to avoid API call during testing
                'latitude': 51.5825,
                'longitude': -0.113504,
                'images': [
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': True,
                        'caption': 'Main View'
                    },
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': False,
                        'caption': 'Interior'
                    },
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': False,
                        'caption': 'Rear View'
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
                'description': 'skdhfkjshdfkjhsdkjfhjksdhfjksdf sdjfhksjdhfkjsdhfkjsdhf ksjdhfkjshdfkjshdf',
                'colour': 'Silver',
                'location': 'Manchester',
                'postcode': 'M1 1AE',
                'description': '2.0 TDI S Line, Navigation Plus',
                # 'vehicle_image_url': '',
                # Add default coordinates to avoid API call during testing
                'latitude': 51.5825,
                'longitude': -0.113504,
                'images': [
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': True,
                        'caption': 'Main View'
                    },
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': False,
                        'caption': 'Interior'
                    },
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': False,
                        'caption': 'Rear View'
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
                'location': 'Birmingham',
                'postcode': 'B1 1BB',
                'description': 'C200 AMG Line Premium Plus',
                # 'vehicle_image_url': '',
                # Add default coordinates to avoid API call during testing
                'latitude': 51.5825,
                'longitude': -0.113504,
                'images': [
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': True,
                        'caption': 'Main View'
                    },
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': False,
                        'caption': 'Interior'
                    },
                    {
                        'url': 'https://www.arnoldclark.com/cdn/images/suv-cars/peugeot-2008.jpg',
                        'is_primary': False,
                        'caption': 'Rear View'
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
            # Add more sample vehicles with different makes, models, and price ranges
        ]
        
        for vehicle_data in vehicles:
            vehicle = Vehicle(**vehicle_data)
            db.session.add(vehicle)
            print(f"Added vehicle: {vehicle.make} {vehicle.model}")  # Debug log
        
        try:
            db.session.commit()
            print("Database seeded successfully!")
            
            # Verify data was saved
            all_vehicles = Vehicle.query.all()
            print(f"Total vehicles in database: {len(all_vehicles)}")
            for v in all_vehicles:
                print(f"Vehicle: {v.make} {v.model}, Coords: {v.latitude}, {v.longitude}")
        except Exception as e:
            print(f"Error seeding database: {e}")
            db.session.rollback()
            
if __name__ == "__main__":
    seed_database()