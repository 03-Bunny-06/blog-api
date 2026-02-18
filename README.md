# Blog API ✍️

A robust and scalable RESTful API for a blog management system, built with Node.js, Express, and MongoDB. This project provides a complete backend solution with role-based access control, JWT authentication, and full CRUD operations for blog content.

The API is fully documented using OpenAPI (Swagger), providing an interactive way to explore and test the endpoints.

**Live Demo:** [https://api-blog-management.onrender.com](https://api-blog-management.onrender.com/user/blogs)  
**Live API Documentation:** [https://api-blog-management.onrender.com/api-docs](https://api-blog-management.onrender.com/api-docs)

## Features⚡

- **Role-Based Access Control**: Differentiated routes and permissions for `Admin` and `User` roles.
- **Authentication**: Secure user and admin authentication using JSON Web Tokens (JWT).
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality for blog posts, managed by admins.
- **Blog Management for Users**:
    - View all blogs with pagination support.
    - Filter blogs by topic.
    - View a specific blog post.
    - Manage a personal list of favorite blogs.
- **API Documentation**: Interactive API documentation powered by Swagger UI.
- **Database Integration**: Seamlessly integrated with MongoDB using Mongoose for data modeling and persistence.

## Tech Stack 🚀

| Technology         | Description                                |
| ------------------ | ------------------------------------------ |
| **Node.js**        | JavaScript runtime environment             |
| **Express.js**     | Web framework for building the REST API    |
| **MongoDB**        | NoSQL database to store application data   |
| **Mongoose**       | ODM library for MongoDB and Node.js        |
| **JSON Web Token (JWT)** | For securing endpoints and managing sessions |
| **dotenv**         | For managing environment variables         |
| **Postman**       | API endpoints testing        |
| **Swagger UI**     | For generating interactive API documentation |

## Getting Started ⚙️

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB (local instance or a cloud-hosted service like MongoDB Atlas)

### Installation & Setup 📦

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/03-Bunny-06/blog-api.git
    cd blog-api
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string and a port number. The `JWT_KEY` is defined in `config.js`.

    ```env
    # .env
    DATABASE_URL="your_mongodb_connection_string"
    PORT=8080
    ```

4.  **Start the server:**
    ```sh
    npm start
    ```
The server will start on the port specified in your `.env` file (or 8080 by default). You can access the API documentation at `http://localhost:8080/api-docs`.

## Data Models 🗂️

### Admin Schema

```javascript
{
    username: String,
    password: String
}
```

### User Schema

```javascript
{
    username: String,
    password: String,
    favouriteBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blogs'
    }]
}
```

### Blogs Schema

```javascript
{
    title: String,
    description: String,
    imageLink: String,
    topic: String
}
```

## API Endpoints 🔗

The API is structured into two main roles: `Admin` and `User`. All protected routes require a JWT token in the `Authorization` header (`Bearer <token>`).

### Admin Routes (`/admin`)

| Method | Endpoint                    | Description                       | Authentication |
| ------ | --------------------------- | --------------------------------- | -------------- |
| `POST` | `/signup`                   | Register a new admin account.     | Open           |
| `POST` | `/signin`                   | Log in and receive an auth token. | Open           |
| `POST` | `/create-blog`              | Create a new blog post.           | Admin          |
| `PUT`  | `/edit-blog/:blogId`        | Update an existing blog post.     | Admin          |
| `DELETE`| `/delete-blog/:blogId`      | Delete a blog post.               | Admin          |

### User Routes (`/user`)

| Method | Endpoint                        | Description                                     | Authentication |
| ------ | ------------------------------- | ----------------------------------------------- | -------------- |
| `POST` | `/signup`                       | Register a new user account.                    | Open           |
| `POST` | `/signin`                       | Log in and receive an auth token.               | Open           |
| `GET`  | `/blogs`                        | Get all blog posts, with pagination and limit.   | Open           |
| `GET`  | `/blogs/:blogId`                | Get details of a specific blog post.            | User           |
| `GET`  | `/search?t=<topic>`        | Filter blogs by a specific topic.               | User           |
| `POST` | `/add-favourite-blog/:blogId`   | Add a blog to the user's favorites list.        | User           |
| `GET`  | `/my-favourite-blogs`           | View all blogs in the user's favorites list.    | User           |

*(Note: The signup and signin can be done through postman as this a complete backend project with no frontend. So the postman acts as a frontend for request & response handling or you can use the Swagger Documentation for API testing and request, response handling.)*

## API Testing with Postman 🧪

- The repository includes a `collection.json` file exported from Postman.  
- It contains structured test folders covering authentication, CRUD operations, protected routes, and error cases.  
- You can import this collection directly into Postman to run predefined requests against the API.

### Import Instructions

1. Open Postman
2. Click Import
3. Load the `collection.json` file
4. Start testing the endpoints
