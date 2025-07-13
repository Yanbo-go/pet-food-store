import axios from "axios";
import reducer, {
  applyCoupon,
  clearCoupon,
  setCoupon,
  removeCoupon,
  removeMessage,
} from "./couponSlice";

jest.mock("axios");

describe("couponSlice單元測試", () => {
  describe("reducers", () => {
    const initialState = {
      code: null,
      final_total: null,
      message: null,
      success: false,
    };

    test("setCouponData", () => {
      const nextState = reducer(
        initialState,
        setCoupon({
          code: "new1010",
          final_total: 304,
          message: "已套用優惠券:new1010",
          success: true,
        })
      );
      expect(nextState).toEqual({
        code: "new1010",
        final_total: 304,
        message: "已套用優惠券:new1010",
        success: true,
      });
    });

    test("setCouponData ActionSuccess狀態為false", () => {
      const nextState = reducer(
        initialState,
        setCoupon({
          code: null,
          final_total: null,
          message: "無此折扣卷",
          success: false,
        })
      );
      expect(nextState).toEqual({
        code: null,
        final_total: null,
        message: "無此折扣卷",
        success: false,
      });
    });

    test("removeCoupon", () => {
      const nextState = reducer(
        initialState,
        removeCoupon({
          code: null,
          final_total: null,
          message: "已取消折扣碼",
          success: false,
        })
      );
      expect(nextState).toEqual({
        code: null,
        final_total: null,
        message: "已取消折扣碼",
        success: false,
      });
    });

    test("removeMessage", () => {
      const nextState = reducer(initialState, removeMessage());
      expect(nextState.message).toEqual("");
    });
  });

  describe("createAsyncThunk", () => {
    const mockResponse = {
      data: {
        success: true,
        message: "折扣成功",
        data: {
          final_total: 1000,
        },
      },
    };

    const mockDispatch = jest.fn(); //模擬 dispatch 函式

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
      axios.post.mockResolvedValue(mockResponse);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("applyCoupon", async () => {
      await applyCoupon("testcode")(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "coupon/setCoupon",
          payload: {
            code: "testcode",
            final_total: 1000,
            message: "折扣成功",
            success: true,
          },
        })
      );

      jest.runAllTimers();

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "coupon/removeMessage",
        })
      );
    });

    test("clearCoupon", async () => {
      await clearCoupon("取消成功")(mockDispatch);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "coupon/removeCoupon",
          payload: {
            code: null,
            final_total: null,
            message: "取消成功",
            success: false,
          },
        })
      );

      jest.runAllTimers();

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "coupon/removeMessage",
        })
      );
    });
  });
});
