// import axios from 'axios';
// import { apiKey } from '../constants/index';

// const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days${params.days}=1&aqi=no&alerts=no`;
// const locatoinEndPoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

// const apiCall = async (endpoint) => {
//     const options = {
//         method: 'GET',
//         url: endpoint
//     }
//     try{
//         const response = await axios.request(options);
//         return response.data;
//     }catch(err){
//         console.log('error', err);
//         return null;
//     }
// }

// export const FetchWetaherForecast = params => {
//     return apiCall(forecastEndpoint(forecaseUrl));
// }
// export const FetchWetaherLoctions = params => {
//     return apiCall(locatoinEndPoint(forecaseUrl));
// }

import axios from "axios";
import { apiKey } from "../constants";

const forecastEndpoint = params=> `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = params=> `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
const apiCall = async (endpoint)=>{
    const options = {
        method: 'GET',
        url: endpoint,
    };

      try{
        const response = await axios.request(options);
        return response.data;
      }catch(error){
        console.log('error: ',error);
        return {};
    }
}

export const fetchWeatherForecast = params=>{
    let forecastUrl = forecastEndpoint(params);
    return apiCall(forecastUrl);
}

export const fetchLocations = params=>{
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}