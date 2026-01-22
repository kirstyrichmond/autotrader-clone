#!/bin/bash

# Activate virtual environment if not already active
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "Activating virtual environment..."
    source autotrader-clone/bin/activate
fi

case "$1" in
    seed)
        echo "Running seed_data.py..."
        cd backend
        python seed_data.py
        cd ..
        echo "✓ Database seeded!"
        ;;
    run)
        echo "Starting Flask server..."
        cd backend
        python run.py
        ;;
    all)
        echo "Running seed_data.py..."
        cd backend
        python seed_data.py
        echo "✓ Database seeded!"
        echo ""
        echo "Starting Flask server..."
        python run.py
        ;;
    *)
        echo "Virtual environment activated."
        echo ""
        echo "Available commands:"
        echo "  source backend.sh seed    # Seed the database"
        echo "  source backend.sh run     # Start the Flask server"
        echo "  source backend.sh all     # Seed + start server"
        ;;
esac
