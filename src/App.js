import React, { useEffect, useState } from "react";

import Login from "./pages/login";
import Home from "./pages/home";
import Profile from "./pages/profile";
import CreateArticle from "./pages/article/create";
import EditArticle from "./pages/article/edit";
import IndexArticle from "./pages/article/index";
import IndexProduct from "./pages/product/index";
import IndexUser from "./pages/user/index";
import IndexEmployee from "./pages/employee/index";
import OpenEmail from "./pages/email/open";
import IndexCompanyAccount from "./pages/account/index";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import { CookiesProvider, useCookies } from "react-cookie";

import Axios from "axios";
import SetPassword from "./pages/setpassword";
Axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [master, setMaster] = useState(false);

  useEffect(() => {
    Axios.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    }).then((response) => {
      if (response.data.acl == 2) setMaster(true);
    });
  }, []);

  return (
    <CookiesProvider>
      <Router>
        <ApplicationRoute master={master} />
      </Router>
    </CookiesProvider>
  );
}

function ApplicationRoute(props) {
  let query = useQuery();

  return (
    <Switch>
      <Route exact path="/">
        <Home master={props.master} />
      </Route>
      <Route exact path="/article">
        <IndexArticle master={props.master} />
      </Route>
      <Route exact path="/article/create">
        <CreateArticle master={props.master} />
      </Route>
      <Route path="/article/:id">
        <EditArticle master={props.master} />
      </Route>
      <Route exact path="/product">
        <IndexProduct master={props.master} />
      </Route>
      <Route path="/login">
        <Login master={props.master} />
      </Route>
      <Route path="/profile">
        <Profile master={props.master} />
      </Route>
      <Route path="/user">
        <IndexUser master={props.master} />
      </Route>
      <Route path="/email">
        <OpenEmail master={props.master} />
      </Route>
      // Set password route
      <Route path="/setpassword">
        <SetPassword token={query.get("token")} />
      </Route>
      // Master routes
      {props.master ? (
        <React.Fragment>
          <Route path="/faq"></Route>
          <Route path="/employee">
            <IndexEmployee master={props.master} />
          </Route>
          <Route path="/account">
            <IndexCompanyAccount master={props.master} />
          </Route>
        </React.Fragment>
      ) : null}
      <Route path="/auth/catch">
        <h1>Tertangkap kamu!</h1>
        <h2>{query.get("code")}</h2>
      </Route>
    </Switch>
  );
}

export default App;
