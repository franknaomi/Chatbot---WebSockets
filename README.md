WebSocket Chatbot Documentation

Overview
This WebSocket Chatbot is designed to assist customers in placing orders for their preferred meals. It provides a chat interface where users can interact with the bot to perform various actions such as placing orders, checking out orders, viewing order history, and more.

The main components of the WebSocket Chatbot include:

WebSocket server for real-time communication
Express.js server for handling HTTP requests
JavaScript code for handling chatbot logic and interactions
Setup and Installation
Prerequisites
Node.js installed on your machine (Download Node.js)
npm package manager (comes with Node.js installation)
Installation Steps
Clone or download the WebSocket Chatbot project from the repository.

Navigate to the project directory in your terminal.

Install the required dependencies using npm:

bash
Copy code
npm install
Start the WebSocket server and Express.js server:

bash
Copy code
node app.js
This will start the servers and make the chatbot accessible at http://localhost:3000.

Usage
Connecting to the Chatbot
Open your web browser and navigate to http://localhost:3000 (or the appropriate URL where the chatbot is hosted).
You will see a chat interface where the bot presents options to the user.
Follow the on-screen instructions to interact with the chatbot.

Available Options
Select 1 to Place an order: Displays a list of items for the user to choose from and place an order.
Select 99 to checkout order: Checks out the current order and confirms the order placement.
Select 98 to see order history: Shows the user's order history.
Select 97 to see current order: Displays the current items in the user's order.
Select 0 to cancel order: Cancels the current order if one exists.

Session Management
User sessions are managed based on their WebSocket connections.
Data is stored in memory to ensure session persistence even after a page refresh.
Files and Structure
app.js: Entry point of the application, sets up WebSocket and Express servers.
public/: Contains static files such as CSS styles.
views/: EJS templates for rendering HTML pages.
routes/: Express.js route handlers for different endpoints.
models/: JavaScript classes for managing users, books, and library data.

Technologies Used
Node.js
Express.js
WebSocket (ws library)
EJS (Embedded JavaScript) for templating.

Notes
This chatbot is designed for demonstration purposes and may require additional features or enhancements for production use.
Ensure proper error handling and security measures are implemented before deploying to a production environment.
