export const baseURL = import.meta.env.PROD 
? '/api' 
: 'http://localhost:3000/api';

export const fetchHello = async () => {
  const response = await fetch(`${baseURL}/`);
  return response.json();
};