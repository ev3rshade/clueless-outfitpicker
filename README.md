# Clueless Outfit Picker 🛍️👚👗👔👖
Welcome to our CAPSTONE PROJECT for CS390 WEB APPLICATION PROGRAMMING @ PURDUE UNIVERSITY
By:
- Hanako Keney
- Bhavya Venkataraghavan
- Sejal Verma
- Chelsea Lee

## Project Overview
Can't decide what to wear? Clueless Outfit Picker is an application that will help you choose an outfit based on a single prompt or view your entire wardrobe at your fingertips!

### Features
1. An outfit generation service which allows users to prompt OpenAI's gpt-4o-mini model for an outfit 👕✨

![alt text](screenshots/Screenshot%202025-12-10%20175156.png)


2. Account creation to allow users to:
    a. Save their generated outfits ⬇️
    b. Add items they have in their wardrobe to to create their own outfits ➕👖

![alt text](screenshots/Screenshot%202025-12-10%20175131.png)


3. A wardrobe that uses a set of tags to filter through the user's items 🏷️🏷️🏷️

![alt text](screenshots/Screenshot%202025-12-10%20175110.png)

## Building the Project
Clone the project

### Install Dependencies
To build the frontend
```
cd frontend && npm install
```

To build the backend
(i)
```
cd backend && npm install
```

### Environment Variables
Create an .env file with:
1. Your OpenAI API key
2. Your MongoDB URI (connection)
3. Port set as 8000 (PORT=8000)
4. A randomly generated JWT_SECRET key for authentication tokens

## Running the Project
#### Frontend
run:
```
cd frontend && npm run dev
```

#### Backend
run:
```
cd backend && node Server.js
```

## Technologies Used in the Project
### Frontend – React, Vite

We used React for its component-based architecture, which makes the UI modular, reusable, and easier to maintain. Its strong ecosystem and modern development patterns are ideal for building interactive user interfaces like the prompt form, outfit display cards, and wardrobe components.

We decided to use Vite as the build tool because it offers extremely fast dev server startup and hot-module reloading. This significantly improves development speed compared to older bundlers like Webpack.

### Backend – Express, Node.js

We decided to use Node.js as it enables fast, scalable JavaScript execution on the server, letting us use a single language across the entire stack.

We decided to use express as it is a lightweight and flexible web framework ideal for building RESTful APIs. We use it to manage user authentication, save outfits, handle wardrobe data, and process prompt requests to the OpenAI API.

### Database – MongoDB

We decided to use MongoDB for its flexible, document-based structure that fits naturally with JSON data.

User accounts, saved outfits, and wardrobe items all map cleanly into document schemas, making MongoDB an easy and scalable choice.

### APIs

OpenAI API (gpt-4o-mini)
Used to process user prompts and generate detailed, personalized outfit recommendations.
GPT-4o-mini was selected for being lightweight, fast, and cost-effective while still providing high-quality text generation.

## What we learned
### Hanako Keney (ev3rshade)
Here are a few key things I learned from this project:

Working with the OpenAI API:
I learned how to send requests to the API, interpret its responses, and apply the correct request/response formats in practice.

Understanding project structure:
I strengthened my understanding of how to structure a project effectively. I organized both the backend and frontend directories to keep the codebase clean, modular, and easy to navigate.

Implementing JWT and Authentication middleware
I reviewed the JWT authentication programs and integrated within each API route that required authentication middleware.

Mastering Git fundamentals and workflows:
I deepened my knowledge of Git, including how to use .gitignore, work with branches, and understand the differences between rebasing and merging to work effectively with my teammates.
