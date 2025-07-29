import { useEffect, useRef, useState, useCallback, useContext } from "react";
import axios from "axios";
import CouponModal from "../../components/admin/CouponModal";
import DeleteModal from "../../components/admin/DeleteModal";
import { Modal } from "bootstrap";
import Pagination from "../../components/Pagination";
import {
  MessageContext,
  handleSuccessMessage,
  handleErrorMessage,
} from "../../context/messageStore";

function AdminCoupons() {
  const apiPath = process.env.REACT_APP_APT_PATH;

  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState({});
  // type: 決定modal 展開的用途
  const [type, setType] = useState("create");
  const [tempCoupon, setTempCoupon] = useState({});

  const couponMoadl = useRef(null);
  const deleteMoadl = useRef(null);
  const [, dispatch] = useContext(MessageContext);

  const getCoupons = useCallback(
    async (page = 1) => {
      try {
        const res = await axios.get(
          `/v2/api/${apiPath}/admin/coupons?page=${page}`
        );
        setCoupons(res.data.coupons);
        setPagination(res.data.pagination);
      } catch (error) {
        handleErrorMessage(dispatch, error);
      }
    },
    [apiPath, dispatch]
  );

  const deleteCoupon = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${apiPath}/admin/coupon/${id}`);
      if (res.data.success) {
        getCoupons();
        closeDeleteModal();
        handleSuccessMessage(dispatch, res);
      }
      console.log(res);
    } catch (error) {
      handleErrorMessage(dispatch, error);
    }
  };

  const openCouponModal = (type, coupon) => {
    setType(type);
    setTempCoupon(coupon);
    couponMoadl.current.show();
  };

  const closeCouponModal = () => {
    couponMoadl.current.hide();
  };

  const openDeleteModal = (coupon) => {
    setTempCoupon(coupon);
    deleteMoadl.current.show();
  };

  const closeDeleteModal = () => {
    deleteMoadl.current.hide();
  };

  useEffect(() => {
    couponMoadl.current = new Modal(document.getElementById("couponModal"), {
      backdrop: "static",
    });
    deleteMoadl.current = new Modal(document.getElementById("deleteModal"), {
      backdrop: "static",
    });
    getCoupons();
  }, [getCoupons]);

  return (
    <div className="p-3">
      <CouponModal
        closeModal={closeCouponModal}
        getCoupons={getCoupons}
        tempCoupon={tempCoupon}
        type={type}
      />
      <DeleteModal
        closeDeleteModal={closeDeleteModal}
        deleteFn={deleteCoupon}
        deleteData={tempCoupon}
      />
      <h3>優惠卷列表</h3>
      <hr />
      <div className="text-end">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => openCouponModal("create", {})}
        >
          建立優惠卷
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">折扣名</th>
            <th scope="col">折扣率</th>
            <th scope="col">到期日</th>
            <th scope="col">優惠碼</th>
            <th scope="col">啟用狀態</th>
            <th scope="col">編輯</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.percent}</td>
                <td>{new Date(item.due_date).toDateString()}</td>
                <td>{item.code}</td>
                <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => openCouponModal("edit", item)}
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
      <Pagination pagination={pagination} changePage={getCoupons} />
    </div>
  );
}

export default AdminCoupons;
