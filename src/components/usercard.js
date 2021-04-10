import React from "react";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import PersonIcon from "@material-ui/icons/Person";

import Typography from "@material-ui/core/Typography";

export default function UserCard(props) {
  return (
    <React.Fragment>
      <Paper style={{ padding: 10, marginBottom: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={2} md={1}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <PersonIcon
                color="primary"
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          </Grid>
          <Grid item xs={10} md={7}>
            <Typography variant="h6">
              {props.user.first_name + " " + props.user.last_name}
            </Typography>
            <Typography variant="subtitle2" style={{ color: "grey" }}>
              {props.user.email}
            </Typography>
            <Typography variant="subtitle2" style={{ marginTop: 5 }}>
              {props.user.city} &bull; {props.user.address}
            </Typography>
          </Grid>
          <Grid item xs md={4}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                height: "100%",
                width: "100%",
              }}
            >
              {props.children}
            </div>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}
