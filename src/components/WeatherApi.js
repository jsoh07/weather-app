import axios from "axios";


const API_KEY = '41bfebb43013855d638a925fc455c3e5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async(endpoint) => {
    try{
        const url = `${BASE_URL}${endpoint}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        return response.data;    
    }catch(error){
        console.error('Error fetching data from Weather:', error);
        throw error;
    }
    
}

export default {fetchWeather};