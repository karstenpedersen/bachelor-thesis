# Use an official lightweight Python image
FROM python:3.10-slim

RUN mkdir -p /run/solution
# Set the working directory inside the container
WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy all project files into the container
COPY . .

# Ensure scripts are executable
RUN chmod +x solver.py


CMD ["python3", "solver.py"]
