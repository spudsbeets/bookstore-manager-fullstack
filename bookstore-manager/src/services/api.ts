const API_BASE_URL = 'http://localhost:3001/api';

// Generic API functions
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// Authors API
export const authorsApi = {
    getAll: () => apiRequest<any[]>('/authors'),
    getById: (id: number) => apiRequest<any>(`/authors/${id}`),
    create: (data: any) => apiRequest<any>('/authors', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/authors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/authors/${id}`, {
        method: 'DELETE',
    }),
};

// Books API
export const booksApi = {
    getAll: () => apiRequest<any[]>('/books'),
    getById: (id: number) => apiRequest<any>(`/books/${id}`),
    create: (data: any) => apiRequest<any>('/books', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/books/${id}`, {
        method: 'DELETE',
    }),
    getAuthors: (bookId: number) => apiRequest<any[]>(`/books/${bookId}/authors`),
    getGenres: (bookId: number) => apiRequest<any[]>(`/books/${bookId}/genres`),
    getLocations: (bookId: number) => apiRequest<any[]>(`/books/${bookId}/locations`),
};

// Publishers API
export const publishersApi = {
    getAll: () => apiRequest<any[]>('/publishers'),
    getById: (id: number) => apiRequest<any>(`/publishers/${id}`),
    create: (data: any) => apiRequest<any>('/publishers', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/publishers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/publishers/${id}`, {
        method: 'DELETE',
    }),
};

// Customers API
export const customersApi = {
    getAll: () => apiRequest<any[]>('/customers'),
    getById: (id: number) => apiRequest<any>(`/customers/${id}`),
    create: (data: any) => apiRequest<any>('/customers', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/customers/${id}`, {
        method: 'DELETE',
    }),
    getOrders: (customerId: number) => apiRequest<any[]>(`/customers/${customerId}/orders`),
};

// Orders API
export const ordersApi = {
    getAll: () => apiRequest<any[]>('/orders'),
    getById: (id: number) => apiRequest<any>(`/orders/${id}`),
    create: (data: any) => apiRequest<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/orders/${id}`, {
        method: 'DELETE',
    }),
};

// OrderItems API
export const orderItemsApi = {
    getByOrderId: (orderId: number) => apiRequest<any[]>(`/order-items?orderId=${orderId}`),
    getById: (id: number) => apiRequest<any>(`/order-items/${id}`),
    create: (data: any) => apiRequest<any>('/order-items', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/order-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/order-items/${id}`, {
        method: 'DELETE',
    }),
};

// Genres API
export const genresApi = {
    getAll: () => apiRequest<any[]>('/genres'),
    getById: (id: number) => apiRequest<any>(`/genres/${id}`),
    create: (data: any) => apiRequest<any>('/genres', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/genres/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/genres/${id}`, {
        method: 'DELETE',
    }),
};

// SalesRateLocations API
export const salesRateLocationsApi = {
    getAll: () => apiRequest<any[]>('/sales-rate-locations'),
    getById: (id: number) => apiRequest<any>(`/sales-rate-locations/${id}`),
    create: (data: any) => apiRequest<any>('/sales-rate-locations', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/sales-rate-locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/sales-rate-locations/${id}`, {
        method: 'DELETE',
    }),
};

// Locations API
export const locationsApi = {
    getAll: () => apiRequest<any[]>('/locations'),
    getById: (id: number) => apiRequest<any>(`/locations/${id}`),
    create: (data: any) => apiRequest<any>('/locations', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/locations/${id}`, {
        method: 'DELETE',
    }),
};

// BookAuthors API
export const bookAuthorsApi = {
    getAll: () => apiRequest<any[]>('/book-authors'),
    getById: (id: number) => apiRequest<any>(`/book-authors/${id}`),
    create: (data: any) => apiRequest<any>('/book-authors', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/book-authors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/book-authors/${id}`, {
        method: 'DELETE',
    }),
};

// BookGenres API
export const bookGenresApi = {
    getAll: () => apiRequest<any[]>('/book-genres'),
    getById: (id: number) => apiRequest<any>(`/book-genres/${id}`),
    create: (data: any) => apiRequest<any>('/book-genres', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/book-genres/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/book-genres/${id}`, {
        method: 'DELETE',
    }),
};

// BookLocations API
export const bookLocationsApi = {
    getAll: () => apiRequest<any[]>('/book-locations'),
    getById: (id: number) => apiRequest<any>(`/book-locations/${id}`),
    create: (data: any) => apiRequest<any>('/book-locations', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id: number, data: any) => apiRequest<any>(`/book-locations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id: number) => apiRequest<void>(`/book-locations/${id}`, {
        method: 'DELETE',
    }),
}; 