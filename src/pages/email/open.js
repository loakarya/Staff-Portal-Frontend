import React, { useEffect, useState } from "react";

import MiniDrawer from "../../components/drawer";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import Axios from "axios";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function EmailOpen(props) {
  const [cookies, setCookie] = useCookies();
  const [redirect, setRedirect] = useState();

  useEffect(() => {
    Axios.get("/employee/email", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        setCookie("roundcube_sessauth", response.data.token.roundcube_sessauth);
        setCookie("roundcube_sessid", response.data.token.roundcube_sessid);
        window.open(process.env.REACT_APP_ROUNDCUBE_URL, "_blank");
        setRedirect("/");
      })
      .catch((error) => console.log(error.response));
  }, []);

  if (redirect) return <Redirect to={redirect} />;

  return (
    <MiniDrawer master={props.master}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <CircularProgress style={{ marginRight: 15 }} size={20} />
        <Typography variant="h6" component="span">
          Redirecting to the Roundcube email portal...
        </Typography>
      </div>
    </MiniDrawer>
  );
}
