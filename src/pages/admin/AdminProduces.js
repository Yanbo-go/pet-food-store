import { useEffect, useRef, useState, useCallback, useContext } from "react";
import axios from "axios";
import ProductModal from "../../components/admin/ProductModal";
import DeleteModal from "../../components/admin/DeleteModal";
import { Modal } from "bootstrap";
import Pagination from "../../components/Pagination";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../../context/messageStore";

function AdminProduces() {
  const apiPath = process.env.REACT_APP_APT_PATH;

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  // type: 決定modal 展開的用途
  const [type, setType] = useState("create");
  const [tempProduct, setTempProduct] = useState({});

  const productMoadl = useRef(null);
  const deleteMoadl = useRef(null);

  const [, dispatch] = useContext(MessageContext);

  const getProducts = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `/v2/api/${apiPath}/admin/products?page=${page}`
        );
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (error) {
        handleErrorMessage(dispatch, error);
      }
    },
    [apiPath, dispatch]
  );

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${apiPath}/admin/product/${id}`);
      if (res.data.success) {
        getProducts();
        closeDeleteModal();
        handleSuccessMessage(dispatch, res);
      }
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  const openProductModal = (type, product) => {
    setType(type);
    setTempProduct(product);
    productMoadl.current.show();
  };

  const closeProductModal = () => {
    productMoadl.current.hide();
  };

  const openDeleteModal = (product) => {
    setTempProduct(product);
    deleteMoadl.current.show();
  };

  const closeDeleteModal = () => {
    deleteMoadl.current.hide();
  };

  useEffect(() => {
    productMoadl.current = new Modal(document.getElementById("productModal"), {
      backdrop: "static",
    });
    deleteMoadl.current = new Modal(document.getElementById("deleteModal"), {
      backdrop: "static",
    });
    getProducts();
  }, [getProducts]);

  return (
    <div className="p-3">
      <ProductModal
        closeProductModal={closeProductModal}
        getProducts={getProducts}
        tempProduct={tempProduct}
        type={type}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        deleteFn={deleteProduct}
        deleteData={tempProduct}
      />
      <h3>產品列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openProductModal("create", {})}
        >
          建立新商品
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">分類</th>
            <th scope="col">名稱</th>
            <th scope="col">售價</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openProductModal("edit", item)}
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => openDeleteModal(item)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getProducts} />
    </div>
  );
}

export default AdminProduces;
