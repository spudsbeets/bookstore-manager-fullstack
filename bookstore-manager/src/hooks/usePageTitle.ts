import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'S&S Home',
  '/books': 'S&S Books',
  '/customers': 'S&S Customers', 
  '/orders': 'S&S Orders',
  '/publishers': 'S&S Publishers',
  '/authors': 'S&S Authors',
  '/genres': 'S&S Genres',
  '/locations': 'S&S Locations',
  '/sales-rates': 'S&S Sales Rates',
  '/inventory': 'S&S Inventory',
  '/book-authors': 'S&S Book Authors',
  '/book-genres': 'S&S Book Genres',
  '/book-locations': 'S&S Book Locations',
  '/order-items': 'S&S Order Items',
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    
    let title = pageTitles[path] || 'S&S Bookstore Manager';
    
    // Handle dynamic titles for view/create/edit modes
    if (mode) {
      const baseTitle = pageTitles[path] || 'S&S Bookstore Manager';
      const modeTitle = mode.charAt(0).toUpperCase() + mode.slice(1);
      title = `${baseTitle} - ${modeTitle}`;
    }
    
    document.title = title;
  }, [location.pathname, location.search]);
} 