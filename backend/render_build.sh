#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Seed the database
python seed_data.py