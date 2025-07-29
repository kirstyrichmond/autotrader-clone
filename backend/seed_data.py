from app import create_app, db
from app.models import Vehicle, User
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
                'location': 'London',
                'postcode': 'SE17PB',
                'description': '320i M Sport, Full Service History',
                'latitude': 51.5825,
                'longitude': -0.113504,
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
                'description': 'skdhfkjshdfkjhsdkjfhjksdhfjksdf sdjfhksjdhfkjsdhfkjsdhf ksjdhfkjshdfkjshdf',
                'colour': 'Silver',
                'location': 'Manchester',
                'postcode': 'M1 1AE',
                'description': '2.0 TDI S Line, Navigation Plus',
                'latitude': 51.5825,
                'longitude': -0.113504,
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
                'location': 'Birmingham',
                'postcode': 'B1 1BB',
                'description': 'C200 AMG Line Premium Plus',
                'latitude': 51.5825,
                'longitude': -0.113504,
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
            'https://m.atcdn.co.uk/a/media/w1024/71084bc77e88403b806d638bb6425bca.jpg',
            'https://m.atcdn.co.uk/a/media/w1024/029ef8db0964456da1296128e3785771.jpg',
            'https://m.atcdn.co.uk/a/media/w480/f668e11f61b74e4a8cfbc8a807d8cbd0.jpg',
            'https://m.atcdn.co.uk/a/media/w480/d2256a9003f34ed18325851d4e06bcae.jpg',
            'https://m.atcdn.co.uk/a/media/w480/b97b4aa46b3b42268ef9592964c0bca8.jpg',
            'https://m.atcdn.co.uk/a/media/w480/a15c273987314e868c0bbdd7c180e0f4.jpg',
            'https://m.atcdn.co.uk/a/media/w480/150d8bf5c0a2473489116b2611ae6d90.jpg',
            'https://m.atcdn.co.uk/a/media/w480/d6eee67d836741ffb6c3609d52956a5b.jpg',
            'https://m.atcdn.co.uk/a/media/w480/5a075ccedabe41abad4792767f0aa7e9.jpg',
            'https://m.atcdn.co.uk/a/media/w480/cebf45def1824d47965e0c32c3527ba1.jpg',
            'https://m.atcdn.co.uk/a/media/w480/b7946e891c974f4f9c10a90ee0995c5b.jpg',
            'https://m.atcdn.co.uk/a/media/w480/6e3c15f5fefe45559ca606370ffed319.jpg',
            'https://m.atcdn.co.uk/a/media/w480/ad874cea8e9b456d9c4d17fd56cbc986.jpg',
            'https://m.atcdn.co.uk/a/media/w480/62c7481f23054a1f9b9f46be363a26ed.jpg',
            'https://m.atcdn.co.uk/a/media/w480/c13a518b984e48d4bf9ec0664a56a28e.jpg'
        ]
        
        fuel_types = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
        transmissions = ['Manual', 'Automatic']
        body_types = ['Hatchback', 'Saloon', 'Estate', 'SUV', 'Coupe', 'Convertible']
        colours = ['Black', 'White', 'Silver', 'Blue', 'Red', 'Grey', 'Green', 'Yellow', 'Orange', 'Purple']
        locations = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Liverpool', 'Edinburgh', 'Bristol']
        postcodes = ['M1 1AA', 'B1 1BB', 'LS1 1CC', 'G1 1DD', 'S1 1EE', 'BD1 1FF', 'L1 1GG', 'EH1 1HH', 'BS1 1II', 'SE1 7PB']
        conditions = ['New', 'Used', 'Nearly New']
        service_histories = ['Full', 'Partial', 'None']
        dealer_names = ['AutoMax', 'CarWorld', 'DriveTime', 'MotorHub', 'VehiclePlus', 'CarCenter', 'AutoDealer', 'CarSales']
        
        for i in range(50):
            make, model = random.choice(makes_models)
            user = random.choice(users)
            location = random.choice(locations)
            postcode = random.choice(postcodes)
            
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
                'location': location,
                'postcode': postcode,
                'description': f'Excellent {make} {model} in great condition. Well maintained vehicle.',
                'latitude': round(random.uniform(50.5, 55.5), 6),
                'longitude': round(random.uniform(-4.5, 1.5), 6),
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