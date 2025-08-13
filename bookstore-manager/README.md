# Bookstore Manager Frontend

A modern, responsive web application for managing bookstore inventory, customers, orders, and relationships built with React, TypeScript, and Vite.

```javascript
/**
 * @date August 4, 2025
 * @based_on The custom frontend architecture designed for this bookstore management application.
 *
 * @degree_of_originality The frontend structure is original work, created to provide a modern, responsive interface for bookstore operations. It follows React best practices but is tailored to the specific needs of inventory management, customer relations, and order processing.
 *
 * @source_url N/A - This frontend implementation is based on the project's unique requirements for a comprehensive bookstore management system.
 *
 * @ai_tool_usage The frontend components and architecture were generated using Cursor, an AI code editor, based on the defined UI requirements and business logic. The generated code was then reviewed, refined, and customized for optimal user experience and accessibility.
 */
```

## 🚀 Features

-  **Book Management**: Create, read, update, and delete books with automatic inventory calculation
-  **Customer Management**: Manage customer information and order history
-  **Order Processing**: Handle customer orders with automatic tax calculations
-  **Inventory Tracking**: Real-time inventory updates via database triggers
-  **Relationship Management**: Link books with authors, genres, and storage locations
-  **Responsive Design**: Modern UI built with Shadcn/ui components
-  **Form Validation**: Comprehensive validation using React Hook Form and Zod
-  **Toast Notifications**: User-friendly feedback with Sonner toast library

## 🛠️ Tech Stack

-  **Frontend Framework**: React 18 with TypeScript
-  **Build Tool**: Vite
-  **UI Components**: Shadcn/ui (built on Radix UI)
-  **Styling**: Tailwind CSS with OKLCH color space
-  **Form Management**: React Hook Form with Zod validation
-  **State Management**: React hooks and context
-  **HTTP Client**: Axios
-  **Date Handling**: date-fns
-  **Notifications**: Sonner toast library

## 🤖 AI-Assisted Development

This project was developed with assistance from **Cursor AI**, an AI-powered coding assistant. The AI helped with:

-  **Code Generation**: Initial project structure and component templates
-  **Bug Fixes**: Resolving accessibility issues, form validation, and date handling problems
-  **Database Integration**: Frontend-backend communication patterns
-  **UI/UX Improvements**: Responsive design and accessibility enhancements
-  **Code Refactoring**: Optimizing component structure and performance

**Note**: While AI assistance was used for development, all final code has been reviewed, tested, and customized for this specific bookstore management application.

## 📋 Prerequisites

-  Node.js 18+
-  npm or yarn
-  Backend server running (see backend README)

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bookstore-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:60730/api/v1
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components for CRUD operations
│   ├── list-views/     # Data display components
│   ├── layout/         # Layout and navigation components
│   └── ui/             # Base UI components (Shadcn/ui)
├── pages/              # Page components
├── services/           # API service layer
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

-  `npm run dev` - Start development server
-  `npm run build` - Build for production
-  `npm run preview` - Preview production build
-  `npm run lint` - Run ESLint
-  `npm run type-check` - Run TypeScript type checking

## 🌐 API Configuration

The frontend connects to a backend API. Update the `VITE_API_BASE_URL` in your `.env.local` file to point to your backend server.

**Default**: `http://localhost:60730/api/v1`

## 🎨 UI Components

This project uses [Shadcn/ui](https://ui.shadcn.com/), a collection of reusable components built on top of Radix UI and Tailwind CSS. Components include:

-  **Forms**: Input, Select, Textarea, Checkbox, Radio
-  **Navigation**: Button, Link, Breadcrumb
-  **Layout**: Card, Dialog, Sheet, Tabs
-  **Feedback**: Toast, Alert, Progress
-  **Data Display**: Table, Badge, Avatar

## 📱 Responsive Design

The application is fully responsive and works on:

-  Desktop (1024px+)
-  Tablet (768px - 1023px)
-  Mobile (320px - 767px)

## 🔒 Form Validation

All forms use comprehensive validation with:

-  **React Hook Form**: Efficient form state management
-  **Zod**: Type-safe schema validation
-  **Real-time validation**: Immediate feedback on user input
-  **Accessibility**: Proper label associations and ARIA attributes

## 🎯 Key Features Implementation

### Inventory Management

-  Automatic inventory calculation via database triggers
-  Real-time updates when book locations change
-  No manual inventory input required

### Date Handling

-  Timezone-safe date selection using date-fns
-  Consistent yyyy-MM-dd format throughout the application
-  Proper date parsing and validation

### Search and Filtering

-  Real-time search across all list views
-  Debounced search for performance
-  Accessible search inputs with proper labels

## 🚨 Error Handling

-  **Toast Notifications**: User-friendly error and success messages
-  **Form Validation**: Clear error messages for invalid input
-  **API Error Handling**: Graceful fallbacks for network issues
-  **Error Boundaries**: Prevents entire page crashes

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🌍 Deployment

The application can be deployed to any static hosting service:

-  **Vercel**: `vercel --prod`
-  **Netlify**: `netlify deploy --prod`
-  **GitHub Pages**: Configure in repository settings
-  **Traditional hosting**: Upload `dist/` contents to your web server

## 🔧 Troubleshooting

### Common Issues

1. **Build errors**: Ensure all dependencies are installed with `npm install`
2. **API connection**: Verify backend server is running and URL is correct
3. **Port conflicts**: Change port in `vite.config.ts` if 5173 is occupied
4. **Type errors**: Run `npm run type-check` to identify TypeScript issues

### Performance Issues

-  Use React DevTools Profiler to identify slow components
-  Check bundle size with `npm run build` and analyze output
-  Consider code splitting for large components

## 📚 Additional Resources

-  [React Documentation](https://react.dev/)
-  [TypeScript Handbook](https://www.typescriptlang.org/docs/)
-  [Vite Guide](https://vitejs.dev/guide/)
-  [Tailwind CSS Documentation](https://tailwindcss.com/docs)
-  [Shadcn/ui Components](https://ui.shadcn.com/)

## 📖 External Code References

The following external resources were referenced during development:

-  **Material Tailwind**: [Navbar Component](https://www.material-tailwind.com/docs/react/navbar#) - Referenced for navigation design patterns
-  **React Router**: [Browser Router Documentation](https://reactrouter.com/6.28.0/router-components/browser-router) - Used for routing implementation
-  **Shadcn/ui**: [Dashboard Example](https://ui.shadcn.com/examples/dashboard) - Referenced for dashboard layout patterns
-  **Global Styles**: [Shadcn Next Template](https://github.com/shadcn-ui/next-template/blob/main/styles/globals.css) - Referenced for CSS variable setup
-  **Dark Mode**: [Shadcn Dark Mode Vite](https://ui.shadcn.com/docs/dark-mode/vite) - Referenced for theme implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This frontend application requires a running backend server. See the backend README for setup instructions.
