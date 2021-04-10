import React, { useEffect, useState } from "react";
import MiniDrawer from "../../components/drawer";
import LoadingData from "../../components/loading";
import { useParams } from "react-router-dom";
import Axios from "axios";

import Article from "../../components/article/canvas";

export default function EditArticle(props) {
  let { id } = useParams();

  const [article, setArticle] = useState({});
  const [articleLoaded, setArticleLoaded] = useState(false);

  useEffect(() => {
    Axios.get("/article/" + id).then((response) => {
      setArticle(response.data.data);
      setArticleLoaded(true);
    });
  }, []);

  if (!articleLoaded)
    return (
      <MiniDrawer title="Edit Article" master={props.master}>
        <LoadingData />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="Edit Article" master={props.master}>
      <Article edit article={article} />
    </MiniDrawer>
  );
}
