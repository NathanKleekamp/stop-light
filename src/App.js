import React, { useEffect } from 'react';
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import './App.css';

const lightMachine = new Machine({
  id: "light",
  initial: "red",
  states: {
    green: {
      on: {
        TIMER: "red",
      }
    },
    yellow: {
      on: {
        TIMER: "green",
      },
    },
    red: {
      on: {
        TIMER: "yellow",
      },
    },
  },
});

const Light = props => {
  const { color } = props;
  const styles = {
    backgroundColor: color,
    height: "200px",
    marginBottom: "5px",
    width: "200px",
  };
  return (
    <div style={styles} />
  );
};

function App() {
  const [current, send] = useMachine(lightMachine);

  useEffect(() => {
    const intervalId = setInterval(() => {
      send("TIMER");
      console.log("interval")
    }, 3000);
    return () => clearInterval(intervalId)
  }, []);

  return (
    <div className="App">
        <Light color={current.matches("red") && "red"} />
        <Light color={current.matches("yellow") && "yellow"} />
        <Light color={current.matches("green") && "green"} />
    </div>
  );
}

export default App;
