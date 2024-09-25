import React, { useState } from "react";
import axios from "axios";
import style from "./weather.module.css";

function Weather() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const fetchWeather = async () => {
        if (!city) return;

        const apiKey = '41bfebb43013855d638a925fc455c3e5';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {
            const response = await axios.get(url);
            setWeather(response.data);
            setError('');
        } catch (err) {
            setError('날씨 정보를 찾을 수 없습니다.');
            setWeather(null);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.section}>
                <div className={style.searchContainer}>
                    <input
                        type="text"
                        className={style.searchBox}
                        placeholder="도시 이름을 입력하세요."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                    />
                    <svg
                        onClick={fetchWeather}
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
            <div>
                {error && <p>{error}</p>}
                {weather && (
                    <div className={style.cityCard}>
                        <h2>{weather.name}</h2>
                        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
                        <p>{weather.main.temp} °C</p>
                        <p>{weather.weather[0].description}</p>
                        <p>습도: {weather.main.humidity}%</p>
                        <p>풍속: {weather.wind.speed} m/s</p>
                        <p>기압: {weather.main.pressure} hPa</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weather;
