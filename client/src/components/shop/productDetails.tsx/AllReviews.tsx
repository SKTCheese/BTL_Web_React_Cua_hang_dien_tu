import React, { Fragment, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "./Action";

import moment from "moment";
import { LayoutContext } from "../layout";
import { deleteReview } from "./Action";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const AllReviews = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  const { pRatingsReviews } = data.singleProductDetail;
  let { id } = useParams();