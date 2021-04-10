import React, { useState, useEffect } from "react";
import MiniDrawer from "../../components/drawer";
import Article from "../../components/article/canvas";

export default function CreateArticle(props) {
  return (
    <MiniDrawer title="Create A New Article" master={props.master}>
      <Article />
    </MiniDrawer>
  );
}
