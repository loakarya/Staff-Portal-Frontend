import {
  Typography,
  Grid,
  Paper,
  Table,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";

import React, { useState, useEffect } from "react";
import MiniDrawer from "../components/drawer";
import LoadingData from "../components/loading";
import { useCookies } from "react-cookie";
import Axios from "axios";
import { Doughnut, Bar, Line } from "react-chartjs-2";

export default function Home(props) {
  const [cookies, setCookies, removeCookies] = useCookies();

  const [user, setUser] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    Axios.get("/auth/me", {
      headers: {
        Authorization: "Bearer " + cookies.access_token,
      },
    }).then((response) => {
      setUser(response.data);
      setUserLoaded(true);
    });

    Axios.get(
      `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.REACT_APP_NEWS_API_KEY}`
    )
      .then((response) => setNews(response.data.results.slice(0, 4)))
      .catch((error) => console.log(error.response));
  }, []);

  if (!userLoaded)
    return (
      <MiniDrawer master={props.master}>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer master={props.master}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
          <Typography variant="h5" style={{ marginBottom: 12 }}>
            Welcome aboard, {user.first_name}!
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold" }}>
                    Information
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold" }} align="right">
                    Data
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Access Control Level
                  </TableCell>
                  <TableCell align="right">
                    {user.acl === 1 ? "Administrator" : "Master"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Division
                  </TableCell>
                  <TableCell align="right">DOR</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Position
                  </TableCell>
                  <TableCell align="right">DOR</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Email
                  </TableCell>
                  <TableCell align="right">{user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Last login time
                  </TableCell>
                  <TableCell align="right">DOR</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Last login IP
                  </TableCell>
                  <TableCell align="right">{user.last_ip}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2} style={{ marginTop: 15 }}>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Registered User
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Article Count
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Product Count
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper style={{ padding: 12 }}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  FAQ Count
                </Typography>
                <Typography variant="subtitle2">12</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {news.map((article, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={`news-article-${index}`}
                  >
                    <Card>
                      <CardActionArea
                        onClick={() => window.open(article.url, "_blank")}
                      >
                        <CardMedia
                          style={{ height: 140 }}
                          image={article.multimedia[2].url}
                          title={article.title}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="h2"
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                          >
                            {article.abstract}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 12 }}>
                <Bar
                  data={{
                    labels: [
                      "Africa",
                      "Asia",
                      "Europe",
                      "Latin America",
                      "North America",
                    ],
                    datasets: [
                      {
                        label: "Population (millions)",
                        backgroundColor: [
                          "#3e95cd",
                          "#8e5ea2",
                          "#3cba9f",
                          "#e8c3b9",
                          "#c45850",
                        ],
                        data: [2478, 5267, 734, 784, 433],
                      },
                    ],
                  }}
                  options={{
                    legend: { display: false },
                    title: {
                      display: true,
                      text: "Predicted world population (millions) in 2050",
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 12 }}>
                <Doughnut
                  data={{
                    labels: [
                      "Africa",
                      "Asia",
                      "Europe",
                      "Latin America",
                      "North America",
                    ],
                    datasets: [
                      {
                        label: "Population (millions)",
                        backgroundColor: [
                          "#3e95cd",
                          "#8e5ea2",
                          "#3cba9f",
                          "#e8c3b9",
                          "#c45850",
                        ],
                        data: [2478, 5267, 734, 784, 433],
                      },
                    ],
                  }}
                  options={{
                    title: {
                      display: true,
                      text: "Predicted world population (millions) in 2050",
                    },
                    legend: {
                      position: "bottom",
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs>
              <Paper style={{ padding: 12 }}>
                <Line
                  data={{
                    labels: [1500, 1600, 1700],
                    datasets: [
                      {
                        data: [86, 114, 106],
                        label: "Africa",
                        borderColor: "#3e95cd",
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    title: {
                      display: true,
                      text: "World population per region (in millions)",
                    },
                    legend: {
                      position: "bottom",
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper style={{ padding: 12 }}>
            <Typography variant="h6" align="center">
              Bantuan
            </Typography>
            <hr />
            <Typography variant="body2" component="span">
              Pada panel admin ini anda bisa melakukan hal-hal berikut:
              <ul>
                <li>cek satu</li>
                <li>cek dua</li>
              </ul>
              Silahkan pilih aksi yang diinginkan dengan mengklik menu yang ada
              di sebelah kiri layar.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </MiniDrawer>
  );
}
