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

    const [fData, setFdata] = useState({
    success: "",
    error: "",
  });

  const currentUser = isAuthenticate();

  const fetchData = async () => {
    try {
      const responseData = await getSingleProduct(id);

      if (responseData?.Product) {
        dispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
      }

      if (responseData?.error) {
        setFdata((prev) => ({ ...prev, error: responseData.error }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteReview = (reviewId) => {
    deleteReview(
      reviewId,
      data.singleProductDetail._id,
      fetchData,
      setFdata
    );
  };

  const canDeleteReview = (reviewUser) => {
    return (
      reviewUser &&
      currentUser &&
      currentUser.user &&
      reviewUser._id === currentUser.user._id
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const active = index < Number(rating);

      return (
        <svg
          key={index}
          className={`w-4 h-4 ${
            active ? "text-yellow-500" : "text-gray-300"
          } fill-current`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    });
  };

  return (
    <Fragment>
      <div className="md:mx-16 lg:mx-20 xl:mx-24 mt-4">
        {fData.success && Alert("green", fData.success)}
        {fData.error && Alert("red", fData.error)}
      </div>

      <div className="mt-6 mb-12 md:mx-16 lg:mx-20 xl:mx-24">
        {!pRatingsReviews || pRatingsReviews.length === 0 ? (
          <div className="text-gray-500 text-sm">No Review found</div>
        ) : (
          <div className="space-y-6">
            {pRatingsReviews.map((review) => (
              <div
                key={review._id}
                className="flex gap-4 border-b pb-5"
              >
                <div>
                  <img
                    className="w-14 h-14 rounded-full object-cover"
                    src="https://secure.gravatar.com/avatar/676d90a1574e9d3ebf98dd36f7adad60?s=60&d=mm&r=g"
                    alt="avatar"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {review.user?.name || "Người dùng"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {moment(review.createdAt).format("lll")}
                      </p>
                    </div>

                    {canDeleteReview(review.user) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-2">
                    {renderStars(review.rating)}
                  </div>

                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    {review.review}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default AllReviews;