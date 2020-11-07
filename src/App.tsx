import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { CloudInstance } from "./components/CloudInstance";
import { Home } from "./components/Home";

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
