import React from "react";
import Weather from "./components/Weather";
import style from "./App.module.css";

function App() {
  return (
    <div className={style.app}>
      <div className={style.container}>
        <div className={style.title}>
          <h1>나의 위치</h1>
        </div>
        <Weather />
      </div>
    </div>
  );
}

export default App;
