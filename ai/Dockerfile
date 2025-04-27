FROM python:3.10-slim

WORKDIR /app

# Install system dependencies including git
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    git \
    cmake \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy AI service code
COPY . .

# Expose the WebSocket port
EXPOSE 8001

# Start the WebSocket service
CMD ["python", "-m", "ai.service.main", "--host", "0.0.0.0", "--port", "8001"]