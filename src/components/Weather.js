import React, { useState, useEffect } from "react";
import style from "./weather.module.css";
import WeatherApi from "./WeatherApi";

function WeatherPopup({ weather, onClose }) {
    if (!weather) return null;

    const timeConvert = (utc) => {
        const date = new Date(utc * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${hours}시 ${minutes}분`;
    };

    return (
        <div className={style.popup}>
            <div className={style.popupContent}>
                <span className={style.popupClose} onClick={onClose}>
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="popup-close" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                </span>
                <h2>{weather.name}</h2>
                <p>최고기온 : {weather.main.temp_max.toFixed(1)}</p>
                <p>최저기온 : {weather.main.temp_min.toFixed(1)}</p>
                <p>체감온도 : {weather.main.feels_like.toFixed(1)}</p>
                <br/>
                <p>일출: {timeConvert(weather.sys.sunrise)}</p>
                <p>일몰: {timeConvert(weather.sys.sunset)}</p>
                <br />
                <p>습도: {weather.main.humidity}%</p>
                <p>구름: {weather.clouds.all}%</p>
                <p>풍속: {weather.wind.speed} m/s</p>
            </div>
        </div>
    );
};

function Weather() {
    const cities = ['Seoul', 'Busan'];
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState("");
    const [selectedWeather, setSelectedWeather] = useState(null);
    const [localLocation, setLocalLocation] = useState(null);

    const fetchWeatherLocation = async (lat, lon) => {
        try {
            const data = await WeatherApi.fetchWeather(`/weather?lat=${lat}&lon=${lon}`);
            setLocalLocation(data);
        } catch (err) {
            alert('위치 정보를 가져올 수 없습니다.');
            setLocalLocation(null);
        }
    };

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherLocation(latitude, longitude);
                    },
                    (error) => {
                        console.log('위치 정보를 가져올 수 없습니다.');
                    }
                );
            } else {
                console.log('이 브라우저는 Geolocation을 지원하지 않습니다.');
            }
        };

        getLocation();    
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const weatherMap = cities.map(city =>
                    WeatherApi.fetchWeather(`/weather?q=${city}`)
                );
                const results = await Promise.all(weatherMap);
                setWeatherData(results);
                setError('');
            } catch (err) {
                console.log('날씨 정보를 찾을 수 없습니다:', error);
                setWeatherData([]);
            }
        };

        fetchWeatherData();
    }, []); 

    const isCityDuplicate = (newCity) => {
        return weatherData.some(weather => weather.name.toLowerCase() === newCity.toLowerCase());
    };
    const removeCity = (cityRemove) => {
        setWeatherData(prevData => prevData.filter(weather => weather.name !== cityRemove));
    };

    const fetchSearchWeather = async () => {
        if (!city) return;

        if(isCityDuplicate(city)){
            alert('이미 추가된 도시입니다.');
            setCity('');
            return;
        }
        
        try {
            const data = await WeatherApi.fetchWeather(`/weather?q=${city}`);
            setWeatherData(prevData => [...prevData, data]);
            setCity('');
            setError('');
        } catch (err) {
            alert('도시 이름을 정확히 입력해 주세요.');
            setCity('');
        }
    };

    const openPopup = (weather) => {
        setSelectedWeather(weather);
    };

    const closePopup = () => {
        setSelectedWeather(null);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>   
            <div className={style.container}>
                {localLocation && (
                    <div className={style.sectionLocal}>
                        <h2>{localLocation.name}</h2>
                        <p>{localLocation.main.temp.toFixed(1)} °C</p>
                        <div className={style.tempDiff}>
                            <p>최고: {localLocation.main.temp_max.toFixed(1)} °C</p>
                            <p>최저: {localLocation.main.temp_min.toFixed(1)} °C</p>
                        </div>
                    </div>
                )}        
            
                <div className={style.section}>
                    <div className={style.searchContainer}>
                        <input
                            type="text"
                            className={style.searchBox}
                            placeholder="도시 이름을 영문으로 입력하고 추가해 보세요."
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
                    {weatherData.map((weather, index) => (
                        <div key={index} className={style.cityCard} onClick={() => openPopup(weather)}>
                            <span onClick={(e) => { e.stopPropagation(); removeCity(weather.name); }} className={style.deleteButton}>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="popup-close" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                            </span>
                            <h2>{weather.name}</h2>
                            <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
                            <p>{weather.main.temp.toFixed(1)} °C</p>
                        </div>
                    ))}
                </div>
                {selectedWeather && (
                    <div className={style.popupOverlay}>
                        <WeatherPopup weather={selectedWeather} onClose={closePopup} />
                    </div>   
                )}
            </div>
        </>
    );
};

export default Weather;
