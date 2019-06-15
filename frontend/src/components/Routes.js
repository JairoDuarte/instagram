import React from "react";
import { Switch, Route } from "react-router-dom";

import Feed from "./page/Feed";
import New from "./page/New";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Feed} />
      <Route path="/new" component={New} />
    </Switch>
  );
}
