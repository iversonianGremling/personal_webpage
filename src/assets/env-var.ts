// export const apiUrl = import.meta.env.VITE_API_URL;

// Remove trailing slash to prevent double slashes
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Ensure no trailing slash
export const apiUrl = rawApiUrl.replace(/\/$/, '');
