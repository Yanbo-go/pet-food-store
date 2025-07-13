import { useEffect, useRef, useState, useCallback, useContext } from "react";
import axios from "axios";
import OrderModal from "../../components/admin/OrderModal";
import DeleteModal from "../../components/admin/DeleteModal";
import Pagination from "../../components/Pagination";
import { Modal } from "bootstrap";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../../store/messageStore";

function AdminOrders() {
  const apiPath = process.env.REACT_APP_APT_PATH;
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempOrder, setTempOrder] = useState({});
  const orderStatusMap = {
    0: "未確認",
    1: "已確認",
    2: "配送中",
    3: "已完成",
  };

  const orderModal = useRef(null);
  const deleteMoadl = useRef(null);

  const [, dispatch] = useContext(MessageContext);

  const getOrders = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `/v2/api/${apiPath}/admin/orders?page=${page}`
        );
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      } catch (error) {
        handleErrorMessage(dispatch, error);
      }
    },
    [apiPath, dispatch]
  );

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${apiPath}/admin/order/${id}`);
      if (res.data.success) {
        getOrders();
        closeDeleteModal();
        handleSuccessMessage(dispatch, res);
      }
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  const openOrderModal = (order) => {
    setTempOrder(order);
    orderModal.current.show();
  };
  const closeOrderModal = () => {
    setTempOrder({});
    orderModal.current.hide();
  };

  const openDeleteModal = (order) => {
    setTempOrder(order);
    deleteMoadl.current.show();
  };

  const closeDeleteModal = () => {
    deleteMoadl.current.hide();
  };

  useEffect(() => {
    orderModal.current = new Modal("#orderModal", {
      backdrop: "static",
    });
    deleteMoadl.current = new Modal(document.getElementById("deleteModal"), {
      backdrop: "static",
    });
    getOrders();
  }, [getOrders]);

  return (
    <div className="p-3">
      <OrderModal
        closeOrderModal={closeOrderModal}
        getOrders={getOrders}
        tempOrder={tempOrder}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        deleteFn={deleteOrder}
        deleteData={tempOrder}
      />
      <h3>訂單列表</h3>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">訂單 id</th>
            <th scope="col">購買用戶</th>
            <th scope="col">訂單金額</th>
            <th scope="col">付款狀態</th>
            <th scope="col">運送狀態</th>
            <th scope="col">留言訊息</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.user?.name}
                  {order.user?.email}
                </td>
                <td>${order.total}</td>
                <td>
                  {order.is_paid ? (
                    <span className="text-success fw-bold">付款完成</span>
                  ) : (
                    "未付款"
                  )}
                </td>
                <td>{orderStatusMap[order.status] || "未確認"}</td>
                <td>{order.message}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      openOrderModal(order);
                    }}
                  >
                    查看
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => openDeleteModal(order)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination pagination={pagination} changePage={getOrders} />
    </div>
  );
}

export default AdminOrders;
