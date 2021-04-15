import React, { useEffect, useState } from "react";
import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import { useParams } from "react-router-dom";
import Axios from "axios";

import Article from "../../components/article/canvas";

import { useCookies } from "react-cookie";

export default function EditArticle(props) {
  let { id } = useParams();

  const [cookies, setCookies, removeCookies] = useCookies();

  const [article, setArticle] = useState({});
  const [articleLoading, setArticleLoading] = useState(false);
  const [master, setMaster] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    Axios.get("/employee/me", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    }).then((response) => {
      if (response.data.acl == 2) setMaster(true);
      setUserLoading(true);
    });

    Axios.get("/article/" + id).then((response) => {
      setArticle(response.data.data);
      setArticleLoading(true);
    });
  }, []);

  if (!userLoading && !userLoading)
    return (
      <MiniDrawer title="Edit Article" master={props.master}>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="Edit Article" master={props.master}>
      <Article edit article={article} master={master} />
    </MiniDrawer>
  );
}
