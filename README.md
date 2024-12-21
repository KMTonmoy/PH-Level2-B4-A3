# 📝 Blog Post API
A robust API built with Express.js, TypeScript, and MongoDB to manage blog posts, users, and authentication, featuring CRUD operations, post management, and user management.

🌟 **Features**
- **Post Management**: Create, view, update, and delete blog posts.
- **Comment Management**: Add, view, and delete comments on posts.
- **User Authentication**: User registration, login, and account blocking.
- **Admin Controls**: Admin can block users and delete posts.
- **Error Handling**: Centralized and standardized error responses.

🔧 **Tech Stack**
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (Mongoose)

📖 **API Endpoints**

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login (authentication)

### Blogs
- `POST /api/blogs` - Create a new blog post
- `PATCH /api/blogs/:id` - Update a blog post by ID
- `DELETE /api/blogs/:id` - Delete a blog post by ID
- `GET /api/blogs` - Get a list of all blog posts (supports search, sorting, and filtering)
  - Example: `GET /api/blogs?search=technology&sortBy=createdAt&sortOrder=desc&filter=60b8f42f9c2a3c9b7cbd4f18`

### Admin
- `PATCH /api/admin/users/:userId/block` - Block a user by user ID
- `DELETE /api/admin/blogs/:id` - Admin deletes a blog post by ID

🌍 **Live API**
Access the live API here: [Blog Post API](https://blogpost-wheat.vercel.app/)

📂 **Repository**
Find the source code here: [GitHub Repository](https://github.com/KMTonmoy/PH-Level2-B4-A3)

🚀 **Installation Process**
1. Clone the repository:
   ```bash
   git clone https://github.com/KMTonmoy/PH-Level2-B4-A3.git
   cd blog-post-api
   npm i 

# 📂  Set up the environment variables
   MONGO_URI= Your MongoDB URI
   PORT= 5000

# 🏃‍➡️ Start the server
   npm run start:dev
