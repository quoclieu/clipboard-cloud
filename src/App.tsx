import React from "react";
// import { db } from "./services/firebase";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import { CloudInstance } from "./components/CloudInstance";
import { Home } from "./components/Home";

// db().ref("/").set({ test: "test" });

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:id">
          <CloudInstance />
        </Route>
        <Route>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
