import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./components/Users/Dashboard";
import Forms from "./components/Users/Forms";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function Routes() {
  return (
    <Router>
        <div>
            <Switch>
            <Route exact path="/">
                <Dashboard />
            </Route>
            <Route exact path="/home">
                <Dashboard />
            </Route>
            <Route exact path="/users">
                <Dashboard />
            </Route>
            <Route exact path="/users/trashed">
                <Dashboard />
            </Route>
            <Route exact path="/users/create">
                <Forms />
            </Route>
            <Route exact path="/users/edit/:id">
                <Forms />
            </Route>
            <Route exact path="/users/show/:id">
                <Forms />
            </Route>
            </Switch>
        </div>
    </Router>
  );
}

if (document.getElementById('routes')) {
    ReactDOM.render(<Routes />, document.getElementById('routes'));
}
