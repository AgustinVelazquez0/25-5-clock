import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Estados para el tiempo de descanso y sesión
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSession, setIsSession] = useState(true); // Si es sesión, si es descanso

  // Efecto para manejar el temporizador
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            if (isSession) {
              // Si es una sesión, pasa a descanso
              setIsSession(false);
              return breakLength * 60;
            } else {
              // Si es descanso, vuelve a sesión
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, isSession, breakLength, sessionLength]);

  // Formatear el tiempo a mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  // Funciones para manejar los botones de incrementar y decrementar
  const handleBreakIncrement = () => {
    if (breakLength < 60) setBreakLength(breakLength + 1);
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) setBreakLength(breakLength - 1);
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) setSessionLength(sessionLength + 1);
    if (!isTimerRunning && isSession) setTimeLeft((sessionLength + 1) * 60);
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) setSessionLength(sessionLength - 1);
    if (!isTimerRunning && isSession) setTimeLeft((sessionLength - 1) * 60);
  };

  // Función para manejar el start/stop
  const handleStartStop = () => {
    setIsTimerRunning((prevState) => !prevState);
  };

  // Función para resetear el temporizador
  const handleReset = () => {
    setIsTimerRunning(false);
    setTimeLeft(sessionLength * 60);
    setBreakLength(5);
    setSessionLength(25);
    setIsSession(true);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  };

  return (
    <div id="app-container" className="clock-container">
      <h1>25 + 5 Clock</h1>

      {/* Break Section */}
      <div id="break-label">Break Length</div>
      <button id="break-decrement" onClick={handleBreakDecrement}>
        -
      </button>
      <span id="break-length">{breakLength}</span>
      <button id="break-increment" onClick={handleBreakIncrement}>
        +
      </button>

      {/* Session Section */}
      <div id="session-label">Session Length</div>
      <button id="session-decrement" onClick={handleSessionDecrement}>
        -
      </button>
      <span id="session-length">{sessionLength}</span>
      <button id="session-increment" onClick={handleSessionIncrement}>
        +
      </button>

      {/* Timer Section */}
      <div id="timer-label">{isSession ? "Session" : "Break"}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>

      {/* Controls */}
      <button id="start_stop" onClick={handleStartStop}>
        {isTimerRunning ? "Pause" : "Start"}
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>

      {/* Beep Sound */}
      <audio
        id="beep"
        src="https://www.soundjay.com/button/beep-07.wav"
        preload="auto"
      ></audio>
    </div>
  );
}

export default App;
