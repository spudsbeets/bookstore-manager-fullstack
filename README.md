# Bookstore Manager

A comprehensive full-stack web application for managing bookstore operations, including inventory, customers, orders, and relationships. Built with modern web technologies and featuring automatic inventory management through database triggers.

```javascript
/**
 * @date August 4, 2025
 * @based_on The custom full-stack architecture designed for this bookstore management application.
 *
 * @degree_of_originality The application structure is original work, created to provide a comprehensive solution for bookstore operations. It follows modern web development best practices but is tailored to the specific needs of inventory management, customer relations, and order processing.
 *
 * @source_url N/A - This full-stack implementation is based on the project's unique requirements for a comprehensive bookstore management system.
 *
 * @ai_tool_usage The application architecture and components were generated using Cursor, an AI code editor, based on the defined requirements and business logic. The generated code was then reviewed, refined, and customized for optimal performance and user experience.
 */
```

## 🏗️ Project Overview

The Bookstore Manager is a complete solution for bookstore operations, featuring:

-  **Frontend**: React-based web interface with TypeScript and modern UI components
-  **Backend**: Node.js/Express.js REST API with comprehensive business logic
-  **Database**: MariaDB/MySQL with stored procedures, triggers, and views
-  **Features**: Real-time inventory tracking, customer management, order processing

## 🚀 Quick Start

### Prerequisites

-  Node.js 18+
-  MariaDB or MySQL database server
-  npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Project-Step-4
```

### 2. Set Up the Backend

```bash
cd controllerAndModel
npm install
# Configure database connection in server.js
node server.js
```

### 3. Set Up the Frontend

```bash
cd ../bookstore-manager
npm install
# Create .env.local with API URL
npm run dev
```

### 4. Access the Application

-  Frontend: http://localhost:5173
-  Backend API: http://localhost:60730/api/v1

## 📁 Project Structure

```
Project-Step-4/
├── bookstore-manager/          # Frontend React application
│   ├── src/                   # Source code
│   ├── package.json           # Frontend dependencies
│   └── README.md              # Frontend documentation
├── controllerAndModel/         # Backend Node.js application
│   ├── controllers/           # API controllers
│   ├── models/                # Database models
│   ├── server.js              # Main server file
│   ├── reset.SQL              # Database schema and data
│   ├── PL.sql                 # Stored procedures
│   ├── DML.sql                # Data manipulation queries
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend documentation
└── README.md                  # This file
```

## 🗄️ Database Setup

### Initial Setup

1. **Create database**

   ```sql
   CREATE DATABASE bookstore_manager;
   USE bookstore_manager;
   ```

2. **Seed the database with stored procedures and functions**

   ```sql
   SOURCE PL.sql;
   ```

3. **Run the complete setup script**
   ```sql
   SOURCE reset.SQL;
   ```

**Note**: The `reset.SQL` script will automatically call the necessary procedures to set up the database schema, but you must first seed the stored procedures from `PL.sql` to ensure all functions and triggers are available.

### Database Reset

Via API endpoint:

```bash
curl -X POST http://localhost:60730/api/v1/reset
```

## 🔄 Key Features

### Automatic Inventory Management

-  **Database Triggers**: Automatically update book inventory when storage locations change
-  **Real-time Updates**: Frontend reflects changes immediately without page refresh
-  **No Manual Input**: Inventory quantities are calculated automatically

### Comprehensive CRUD Operations

-  **Books**: Full book management with author/genre relationships
-  **Customers**: Customer information and order history
-  **Orders**: Order processing with automatic tax calculations
-  **Relationships**: Manage book-author, book-genre, and book-location connections

### Modern Web Interface

-  **Responsive Design**: Works on desktop, tablet, and mobile
-  **Accessibility**: Proper ARIA labels and keyboard navigation
-  **Form Validation**: Real-time validation with clear error messages
-  **Toast Notifications**: User-friendly feedback system

## 🛠️ Technology Stack

### Frontend

-  **React 18** with TypeScript
-  **Vite** for fast development and building
-  **Shadcn/ui** for modern UI components
-  **Tailwind CSS** for styling
-  **React Hook Form** with Zod validation
-  **Axios** for API communication

### Backend

-  **Node.js** with Express.js
-  **mysql2** for database connectivity
-  **MariaDB/MySQL** database
-  **Stored Procedures** for business logic
-  **Database Triggers** for automation

## 🤖 AI-Assisted Development

This project was developed with assistance from **Cursor AI**, an AI-powered coding assistant. The AI helped with:

-  **Full-Stack Architecture**: Complete application design and structure
-  **Database Design**: Schema optimization and relationship modeling
-  **API Development**: RESTful endpoint design and implementation
-  **Frontend Components**: React component architecture and styling
-  **Bug Fixes**: Resolving complex issues across the stack
-  **Performance Optimization**: Code improvements and best practices

**Note**: While AI assistance was used for development, all final code has been reviewed, tested, and customized for this specific bookstore management application.

## 📖 External Code References

The following external resources were referenced during development:

### Frontend

-  **Material Tailwind**: [Navbar Component](https://www.material-tailwind.com/docs/react/navbar#) - Navigation design patterns
-  **React Router**: [Browser Router](https://reactrouter.com/6.28.0/router-components/browser-router) - Routing implementation
-  **Shadcn/ui**: [Dashboard Example](https://ui.shadcn.com/examples/dashboard) - Layout patterns
-  **Global Styles**: [Shadcn Next Template](https://github.com/shadcn-ui/next-template/blob/main/styles/globals.css) - CSS setup
-  **Dark Mode**: [Shadcn Dark Mode Vite](https://ui.shadcn.com/docs/dark-mode/vite) - Theme implementation

### Backend

-  **Express.js**: [Official Documentation](https://expressjs.com/) - Web framework
-  **MySQL2**: [GitHub Repository](https://github.com/sidorares/node-mysql2) - Database driver
-  **MariaDB**: [Official Documentation](https://mariadb.org/kb/en/) - Database compatibility

## 🧪 Testing

### Backend Testing

```bash
cd controllerAndModel
# Test health endpoint
curl http://localhost:60730/api/v1/health

# Test database reset
curl -X POST http://localhost:60730/api/v1/reset
```

### Frontend Testing

```bash
cd bookstore-manager
# Run type checking
npm run type-check

# Build for production
npm run build
```

## 🚀 Deployment

### Backend Deployment

1. Configure production database credentials
2. Set environment variables
3. Use PM2 or similar process manager
4. Consider Docker containerization

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy `dist/` folder to static hosting
3. Update API base URL for production

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**

   -  Verify database server is running
   -  Check credentials in backend configuration
   -  Ensure database exists and is accessible

2. **Port Conflicts**

   -  Backend: Change port in `server.js` (default: 60730)
   -  Frontend: Change port in `vite.config.ts` (default: 5173)

3. **Build Errors**

   -  Ensure all dependencies are installed
   -  Check TypeScript configuration
   -  Verify import paths are correct

4. **API Errors**
   -  Check backend server is running
   -  Verify API base URL in frontend
   -  Check CORS configuration

## 📚 Documentation

-  **[Frontend README](bookstore-manager/README.md)** - Complete frontend setup and usage
-  **[Backend README](controllerAndModel/README.md)** - Backend setup, API endpoints, and database
-  **Code Comments** - Extensive inline documentation throughout the codebase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (frontend and backend)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

-  **Cursor AI** for development assistance and code generation
-  **Shadcn/ui** for the excellent component library
-  **React and Node.js** communities for the robust frameworks
-  **MariaDB/MySQL** for reliable database technology

---

**Note**: This is a full-stack application requiring both frontend and backend to be running. See individual README files for detailed setup instructions.
