#!/bin/bash

echo "Setting up Python 3.11 virtual environment..."

# Deactivate current virtual environment if active
if [[ -n "$VIRTUAL_ENV" ]]; then
    echo "Deactivating current virtual environment..."
    deactivate
fi

# Remove old virtual environment
if [[ -d "autotrader-clone" ]]; then
    echo "Removing old virtual environment..."
    rm -rf autotrader-clone
fi

# Create new virtual environment with Python 3.11
echo "Creating new virtual environment with Python 3.11..."
/opt/homebrew/bin/python3.11 -m venv autotrader-clone

# Activate the new virtual environment
echo "Activating virtual environment..."
source autotrader-clone/bin/activate

# Verify Python version
echo "Python version: $(python --version)"

# Install requirements
echo "Installing requirements..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "✓ Virtual environment setup complete!"

# Handle additional commands
case "$1" in
    seed)
        echo ""
        echo "Running seed_data.py..."
        cd backend
        python seed_data.py
        cd ..
        echo "✓ Database seeded!"
        ;;
    run)
        echo ""
        echo "Starting Flask server..."
        cd backend
        python run.py
        ;;
    all)
        echo ""
        echo "Running seed_data.py..."
        cd backend
        python seed_data.py
        echo "✓ Database seeded!"
        echo ""
        echo "Starting Flask server..."
        python run.py
        ;;
    *)
        echo ""
        echo "Virtual environment is now active."
        echo ""
        echo "Next steps:"
        echo "  cd backend"
        echo "  python seed_data.py    # Seed the database"
        echo "  python run.py          # Start the Flask server"
        echo ""
        echo "Or re-run with options:"
        echo "  source setup_venv.sh seed    # Setup + seed database"
        echo "  source setup_venv.sh run     # Setup + start server"
        echo "  source setup_venv.sh all     # Setup + seed + start server"
        ;;
esac
