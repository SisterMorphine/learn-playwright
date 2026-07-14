// export const TEST_URLS = {
//   login: 'https://qaplayground.com/bank/login',
//   dashboard: 'https://qaplayground.com/bank/dashboard'
// };

export const AUTH_FILES = {
  admin: 'playwright/.auth/admin.json',
  viewer: 'playwright/.auth/viewer.json',
};

export const API_ENDPOINTS = {
  catFactsBaseURL: 'https://catfact.ninja',
  catFactsList: 'https://catfact.ninja/facts',
  catAPI: 'https://api.thecatapi.com/v1',
  catImages: 'https://api.thecatapi.com/v1/images/search'
};

// API Keys - loaded from environment variables
export const API_KEYS = {
  catAPI: process.env.CAT_API_KEY || '',
};

// Helper function to get auth headers for Cat API
export function getCatAPIHeaders() {
  return {
    'x-api-key': API_KEYS.catAPI,
  };
}

export const TEST_USERS = {
  admin: {
    username: 'admin_user',
    password: 'admin_sauce',
  },
  viewer: {
    username: 'standard_user',
    password: 'bank_sauce',
  },
};