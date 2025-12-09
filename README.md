# Clueless Outfit Picker 🛍️👚👗👔👖
Welcome to our CAPSTONE PROJECT for CS390 WEB APPLICATION PROGRAMMING @ PURDUE UNIVERSITY

## About our project
Can't decide what to wear? Clueless Outfit Picker is an application that will help you choose an outfit based off of a single prompt!

What it includes
1. A outfit generation service which allows useres to prompt OpenAI's gpt-4o-mini model for an outfit 👕✨
2. Account creation to allow users to:
    a. Save their generated outfits ⬇️
    b. Add items they have in their wardrobe to view to create their own outfits ➕👖

## Building the Project
Clone the project

To build the frontend
```
cd frontend && npm install
```

To build the backend
```
cd backend && npm install
```

## Running the Project
#### Frontend
run:
```
cd frontend && npm run dev
```
(explain what the frontend is running on and how it runs)

#### Backend
run:
```
cd backend && node Server.js
```

## Technologies Used in the Project
### Frontend – React, Vite

We used React for its component-based architecture, which makes the UI modular, reusable, and easier to maintain. Its strong ecosystem and modern development patterns are ideal for building interactive user interfaces like the prompt form, outfit display cards, and wardrobe components.

We decided to use vite as the build tool because it offers extremely fast dev server startup and hot-module reloading. This significantly improves development speed compared to older bundlers like Webpack.

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
Here are a few key things I learned:

Working with the OpenAI API:
I learned how to send requests to the API, interpret its responses, and apply the correct request/response formats in practice.

Understanding project structure:
I strengthened my understanding of how to structure a project effectively. I organized both the backend and frontend directories to keep the codebase clean, modular, and easy to navigate.

Mastering Git fundamentals and workflows:
I deepened my knowledge of Git, including how to use .gitignore, work with branches, and understand the differences between rebasing and merging.