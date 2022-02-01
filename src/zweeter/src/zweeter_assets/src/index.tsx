import * as React from "react";
import { zweeter } from "../../declarations/zweeter";
import { render } from "react-dom";

import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("app")
// );

const MyHello = () => {
  const [name, setName] = React.useState("");
  const [message, setMessage] = React.useState("");

  async function doGreet() {
    const greeting = await zweeter.greet(name);
    setMessage(greeting);
  }

  return (
    <div style={{ fontSize: "30px" }}>
      <div style={{ backgroundColor: "yellow" }}>
        <p>Greetings, from the Zweeter TEST APP!</p>
        <p>
          {" "}
          Type your message in the Name input field, then click{" "}
          <b> Get Greeting</b> to display the result.
        </p>
      </div>
      <div style={{ margin: "30px" }}>
        <input
          id="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        ></input>
        <button onClick={doGreet}>Get Greeting!</button>
      </div>
      <div>
        Greeting is: "<span style={{ color: "blue" }}>{message}</span>"
      </div>
    </div>
  );
};

render(<MyHello />, document.getElementById("app"));
