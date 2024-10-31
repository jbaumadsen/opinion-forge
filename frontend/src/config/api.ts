// export const baseURL = import.meta.env.PROD 
// ? '/api' 
// : 'http://localhost:3000/api';

// export const baseURL = 'http://localhost:3000/api';

// export const fetchHello = async () => {
//   const response = await fetch(`${baseURL}/`);
//   return response.json();
// };

interface ApiConfig {
  baseURL: string;
}

const isProd = process.env.PROD_BOOL === 'true';

export const apiConfig: ApiConfig = {
  baseURL: isProd ? '/api' : 'http://localhost:3000/api',
};



