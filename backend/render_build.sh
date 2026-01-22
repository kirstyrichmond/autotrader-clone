#!/bin/bash

# Change to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Seed the database
python seed_data.py