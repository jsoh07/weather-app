import React, { useState, useEffect } from "react";
import style from "./weather.module.css";
import WeatherApi from "./WeatherApi";

function Weather() {
    const [city, setCity] = useState("");
    const cities = ['Seoul', 'Bucheon'];
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState("");
    
    const fetchWeatherData = async() => {
        try{
            const weatherMap = cities.map(city =>
                WeatherApi.fetchWeather(`/weather?q=${city}`)
            );
            const results = await Promise.all(weatherMap);
            setWeatherData(results);
            setError('');
        }catch(err){
            setError('날씨 정보를 찾을 수 없습니다.');
            setWeatherData([]);
        }
    };

    useEffect(() => {
        fetchWeatherData(cities);
    }, []);

    const fetchSearchWeather = async () => {
        if (!city) return;
        //https://api.openweathermap.org/data/2.5/forecast endPoint
        //https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}&units=metric 요청예시

        try {
            const data = await WeatherApi.fetchWeather(`/weather?q=${city}`);
            setWeatherData(prevData => [...prevData, data]);
            setCity('');
            setError('');
        } catch (err) {
            alert('날씨 정보를 찾을 수 없습니다.');
            setCity('');
        }
    };
    

    return (
        <div className={style.container}>
            <div className={style.section}>
                <div className={style.searchContainer}>
                    <input
                        type="text"
                        className={style.searchBox}
                        placeholder="도시 이름을 영문으로 입력해주세요."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchSearchWeather()}
                    />
                    <svg
                        onClick={fetchSearchWeather}
                        className={style.searchIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24px"
                        width="24px"
                    >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>
                </div>
            </div>
            <div className={style.sectionCard}>
                {error && <p>{error}</p>}
                {weatherData.map((weather, index) => (
                    <div key={index} className={style.cityCard}>
                        <h2>{weather.name}</h2>
                        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
                        <p>{weather.main.temp} °C</p>
                        {/* <p>{weather.weather[0].description}</p> */}
                        {/* <p>습도: {weather.main.humidity}%</p>
                        <p>풍속: {weather.wind.speed} m/s</p>
                        <p>기압: {weather.main.pressure} hPa</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;
