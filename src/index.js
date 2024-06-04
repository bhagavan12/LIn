import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router} from "react-router-dom";
import "./index.css";
import App1 from "./App1";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App1 />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
