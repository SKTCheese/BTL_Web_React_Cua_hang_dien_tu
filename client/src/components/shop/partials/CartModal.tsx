import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi";
import { isAuthenticate } from "../auth/fetchApi";
import { cartList } from "../productDetails/Mixins";
import { subTotal, quantity, totalCost } from "./Mixins";

const apiURL = "http://localhost:8000";

interface Product {
  _id: string;
  name: string;
  price: number;
  pImages?: Array<{ img: string }>;
  quantity?: number;
}

const CartModal = () => {
  const history = useHistory();

  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.log(error);
    }
  };

    const updateQuantity = (
    productId: string,
    type: "increase" | "decrease"
  ) => {
    let cart = cartList();

    const updatedCart = cart.map((item: any) => {
      if (item.id === productId || item._id === productId) {
        let newQty = item.quantitiy || item.quantity || 1;

        if (type === "increase") {
          newQty += 1;
        } else if (type === "decrease" && newQty > 1) {
          newQty -= 1;
        }

        return {
          ...item,
          quantitiy: newQty,
          quantity: newQty,
        };
      }
      return item;
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    fetchData();
  };

  const removeProduct = (productId: string) => {
    let cart = cartList();

    const updatedCart = cart.filter(
      (item: any) => item.id !== productId && item._id !== productId
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    dispatch({ type: "cartProduct", payload: [] });
    dispatch({ type: "cartTotalCost", payload: totalCost() });

    fetchData();
  };
