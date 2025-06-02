import axios from 'axios'

const API_URL = import.meta.env.VUE_APP_API_URL

export async function getVociMenu(token) {
  try {
    const response = await axios.get(`https://tesi-be-h6b5fnbgesbmacb8.italynorth-01.azurewebsites.net/api/Layout/GetVociMenu`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.data
  } catch (error) {
    console.error('Errore durante il fetch del menu:', error)
    return []
  }
}