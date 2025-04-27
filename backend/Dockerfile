FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .

# Install Python dependencies including email-validator and passlib
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir email-validator pydantic[email] passlib[bcrypt]

# Copy backend code
COPY . .

# Expose API port
EXPOSE 8000

# Environment variables
ENV MONGO_URI=mongodb://mongodb:27017

# Start FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]