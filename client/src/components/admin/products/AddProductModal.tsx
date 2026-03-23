import React, { Fragment, useContext, useState, useEffect } from "react";
import { ProductContext } from "./index";
import { createProduct, getAllProduct } from "./FetchApi";
import { getAllCategory } from "../categories/FetchApi";

type ProductForm = {
  pName: string;
  pDescription: string;
  pStatus: string;
  pImage: FileList | null;
  pCategory: string;
  pPrice: number | "";
  pOffer: number | "";
  pQuantity: number | "";
  success: boolean;
  error: string;
};

const AddProductDetail = ({ categories }: any) => {
  const { data, dispatch } = useContext(ProductContext);

  const alert = (msg: string, type: string) => (
    <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
  );

  const [fData, setFdata] = useState<ProductForm>({
    pName: "",
    pDescription: "",
    pStatus: "Active",
    pImage: null,
    pCategory: "",
    pPrice: "",
    pOffer: "",
    pQuantity: "",
    success: false,
    error: "",
  });

  const fetchData = async () => {
    let responseData = await getAllProduct();
    if (responseData && responseData.Products) {
      dispatch({
        type: "fetchProductsAndChangeState",
        payload: responseData.Products,
      });
    }
  };

  //SUBMIT 
  const submitForm = async (e: any) => {
    e.preventDefault();

    if (!fData.pImage) {
      setFdata({ ...fData, error: "Please upload at least 2 images" });
      return;
    }

    try {
      const payload = {
        ...fData,
        pPrice: Number(fData.pPrice),
        pOffer: Number(fData.pOffer),
        pQuantity: Number(fData.pQuantity),
      };

      let responseData = await createProduct(payload);

      if (responseData.success) {
        fetchData();

        setFdata({
          pName: "",
          pDescription: "",
          pStatus: "Active",
          pImage: null,
          pCategory: "",
          pPrice: "",
          pOffer: "",
          pQuantity: "",
          success: true,
          error: "",
        });
      } else {
        setFdata({ ...fData, error: responseData.error || "Error" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //UI
  return (
    <Fragment>
      {/* Overlay */}
      <div
        onClick={() =>
          dispatch({ type: "addProductModal", payload: false })
        }
        className={`${
          data.addProductModal ? "" : "hidden"
        } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />

      {/* Modal */}
      <div
        className={`${
          data.addProductModal ? "" : "hidden"
        } fixed inset-0 flex items-center z-30 justify-center`}
      >
        <div className="h-full overflow-auto mt-32 md:mt-0 relative bg-white w-11/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 px-4 py-4 md:px-8">
          
          <div className="flex items-center justify-between w-full pt-4">
            <span className="font-semibold text-2xl">Add Product</span>
            <span
              onClick={() =>
                dispatch({ type: "addProductModal", payload: false })
              }
              className="cursor-pointer text-white bg-gray-800 p-2 rounded-full"
            >
              ✕
            </span>
          </div>

          {fData.error && alert(fData.error, "red")}
          {fData.success && alert("Created successfully", "green")}

          <form className="w-full" onSubmit={submitForm}>
            
            <div className="flex space-x-2 py-4">
              <input
                value={fData.pName}
                onChange={(e) =>
                  setFdata({ ...fData, pName: e.target.value, error: "" })
                }
                placeholder="Product Name"
                className="w-1/2 px-4 py-2 border"
              />

              <input
                value={fData.pPrice}
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    pPrice:
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value),
                  })
                }
                type="number"
                placeholder="Price"
                className="w-1/2 px-4 py-2 border"
              />
            </div>

            <textarea
              value={fData.pDescription}
              onChange={(e) =>
                setFdata({ ...fData, pDescription: e.target.value })
              }
              className="w-full px-4 py-2 border"
              placeholder="Description"
            />

            <input
              type="file"
              multiple
              onChange={(e) =>
                setFdata({
                  ...fData,
                  pImage: e.target.files,
                })
              }
              className="mt-4"
            />

            <div className="flex space-x-2 py-4">
              <select
                value={fData.pStatus}
                onChange={(e) =>
                  setFdata({ ...fData, pStatus: e.target.value })
                }
                className="w-1/2 border px-2"
              >
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>

              <select
                value={fData.pCategory}
                onChange={(e) =>
                  setFdata({ ...fData, pCategory: e.target.value })
                }
                className="w-1/2 border px-2"
              >
                <option value="">Select category</option>
                {Array.isArray(categories) &&
                  categories.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.cName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex space-x-2 py-4">
              <input
                value={fData.pQuantity}
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    pQuantity:
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value),
                  })
                }
                type="number"
                placeholder="Stock"
                className="w-1/2 border px-2"
              />

              <input
                value={fData.pOffer}
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    pOffer:
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value),
                  })
                }
                type="number"
                placeholder="Offer %"
                className="w-1/2 border px-2"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded"
            >
              Create product
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

// MODAL
const AddProductModal = () => {
  const [allCat, setAllCat] = useState<any[]>([]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    let res = await getAllCategory();
    if (res.Categories) {
      setAllCat(res.Categories);
    }
  };

  return (
    <Fragment>
      <AddProductDetail categories={allCat} />
    </Fragment>
  );
};

export default AddProductModal;