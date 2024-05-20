# Sleep Tracker API

This is a simple API for tracking sleep data. It allows you to store, retrieve, update, and delete sleep records.

## Setup and Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arpangarg05/sleep-api.git
   cd sleep-tracker-api
   ```
2. **Install dependencies::**
   ```bash
   npm install
   ```
3. **Start the server:**
     ```bash
   node index.js
   ```
## Endpoints
### POST /sleep
Store sleep data.
- Request Body:
   ```bash
   {
     "userId": "string",
     "hours": "number",
     "timestamp": "ISO 8601 string"
   }
   ```
- Response:
    ```bash
    {
      "id": "number",
      "userId": "string",
      "hours": "number",
      "timestamp": "ISO 8601 string"
    }
    ```
  
  
## GET /sleep/:userId

Retrieve sleep data for a user.
- Response:

    ```bash
    [
      {
        "id": "number",
        "userId": "string",
        "hours": "number",
        "timestamp": "ISO 8601 string"
      }
    ]
     ```
## GET /users
Retrieve a list of all users.

- Response:
    ```bash
    ["userId1", "userId2", "userId3"]
     ```
## DELETE /sleep/:recordId
Delete a specific sleep record.

- Response: 204 No Content
## PUT /sleep/:recordId
Update a specific sleep record.

- Request Body:
    ```bash
    {
      "userId": "string",
      "hours": "number",
      "timestamp": "ISO 8601 string"
    }
    ```
- Response:
    ```bash
    {
      "id": "number",
      "userId": "string",
      "hours": "number",
      "timestamp": "ISO 8601 string"
    }
    ```

## POST /sleep/:userId
Add more sleep data for a specific user.

- Request Body:

    ```bash
    {
      "hours": "number",
      "timestamp": "ISO 8601 string"
    }
    ```
- Response:

    ```bash
    {
      "id": "number",
      "userId": "string",
      "hours": "number",
      "timestamp": "ISO 8601 string"
    }
    ```