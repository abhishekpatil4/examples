echo "Creating virtual environment..."
python3 -m venv ~/.venvs/create_event

echo "Activating virtual environment..."
source ~/.venvs/create_event/bin/activate

echo "Installing libraries from requirements.txt..."
pip install -r requirements.txt

if [ -f ".env.example" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
else
    echo "No .env.example file found. Creating a new .env file..."
    touch .env
fi
echo "Please fill in the .env file with the necessary environment variables."

echo "Setup completed successfully!"