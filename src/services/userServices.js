import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VUE_APP_API_URL,  
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getInvestments = async () => {
  try {
    const response = await apiClient.get('/investments');
    return response.data;  
  } catch (error) {
    console.error('Errore nel recupero degli investimenti:', error);
    throw error;
  }
};

export const simulateInvestment = async (investmentData) => {
  try {
    const response = await apiClient.post('/simulate-investment', investmentData);
    return response.data;  
  } catch (error) {
    console.error('Errore nella simulazione dell\'investimento:', error);
    throw error;
  }
};