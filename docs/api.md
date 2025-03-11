# API Documentation for Code Suggestion Agent

## Overview
This document provides an overview of the API endpoints available in the Code Suggestion Agent project. The API is designed to facilitate communication between the frontend and backend components, enabling real-time code suggestions and interactions.

## Base URL
The base URL for the API is:
```
http://localhost:8000/api
```

## Endpoints

### 1. Get Code Suggestions
- **Endpoint:** `/suggestions`
- **Method:** `GET`
- **Description:** Retrieves code suggestions based on the provided context.
- **Query Parameters:**
  - `context` (string, required): The context or code snippet for which suggestions are requested.
- **Response:**
  - **200 OK**
    ```json
    {
      "suggestions": [
        "suggestion_1",
        "suggestion_2",
        ...
      ]
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "detail": "Invalid context provided."
    }
    ```

### 2. Submit Code Feedback
- **Endpoint:** `/feedback`
- **Method:** `POST`
- **Description:** Submits user feedback on a specific code suggestion.
- **Request Body:**
  ```json
  {
    "suggestion_id": "string",
    "feedback": "string"
  }
  ```
- **Response:**
  - **201 Created**
    ```json
    {
      "message": "Feedback submitted successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "detail": "Invalid feedback data."
    }
    ```

### 3. WebSocket Connection
- **Endpoint:** `/ws`
- **Method:** `GET`
- **Description:** Establishes a WebSocket connection for real-time communication.
- **Response:**
  - **101 Switching Protocols** (on successful connection)

## Authentication
Currently, the API does not require authentication. However, this may change in future versions.

## Error Handling
All error responses will include a `detail` field with a description of the error.

## Conclusion
This API documentation provides a basic overview of the available endpoints for the Code Suggestion Agent project. For further details on implementation and usage, please refer to the source code and additional documentation.