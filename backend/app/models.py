from datetime import datetime, timezone
from . import db
from flask_login import UserMixin
from sqlalchemy.types import TypeDecorator, TEXT
import json

class JSONEncodedDict(TypeDecorator):
    impl = TEXT

    def process_bind_param(self, value, dialect):
        if value is not None:
            return json.dumps(value)
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            return json.loads(value)
        return None

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # Add user relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('vehicles', lazy=True))
    
    # Add status and timestamps
    status = db.Column(db.String, default='active')  # active, expired, deleted
    created_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc), onupdate=datetime.now(tz=timezone.utc))
    
    # Existing fields
    make = db.Column(db.String)
    model = db.Column(db.String)
    year = db.Column(db.String)
    mileage = db.Column(db.String)
    fuel_type = db.Column(db.String)
    body_type = db.Column(db.String)
    transmission = db.Column(db.String)
    owners = db.Column(db.Integer)
    mot_due = db.Column(db.String)
    colour = db.Column(db.String)
    price = db.Column(db.Float)
    description = db.Column(db.Text)
    location = db.Column(db.String)
    postcode = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    power = db.Column(db.String)
    service_history = db.Column(db.String)
    condition = db.Column(db.String)
    dealer_name = db.Column(db.String)
    dealer_rating = db.Column(db.Float)
    review_count = db.Column(db.Integer)
    engine_size = db.Column(db.String)
    attention_grabber = db.Column(db.String)
    images = db.Column(JSONEncodedDict)

favorites = db.Table('favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('vehicle_id', db.Integer, db.ForeignKey('vehicle.id'), primary_key=True),
    db.Column('created_at', db.DateTime, default=datetime.now(tz=timezone.utc))
)

class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))

    favorite_vehicles = db.relationship(
        'Vehicle',
        secondary=favorites,
        lazy='dynamic',
        backref=db.backref('favorited_by', lazy='dynamic')
    )
    
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.created_at = datetime.now()

    def __repr__(self):
        return f"<email {self.email}>"