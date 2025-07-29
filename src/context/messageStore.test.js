import {
  initState,
  messageReducer,
  handleSuccessMessage,
  handleErrorMessage,
} from "./messageStore";

describe("messageStore單元測試", () => {
  describe("messageReducer", () => {
    test("POST_MESSAGE", () => {
      const action = {
        type: "POST_MESSAGE",
        payload: {
          type: "success",
          title: "更新成功",
          text: "資料已更新",
        },
      };

      const nextState = messageReducer(initState, action);
      expect(nextState).toEqual(action.payload);
    });

    test("CLEAR_MESSAGE", () => {
      const action = {
        type: "CLEAR_MESSAGE",
      };

      const nextState = messageReducer(initState, action);
      expect(nextState).toEqual({
        type: "",
        title: "",
        text: "",
      });
    });

    test("Other", () => {
      const action = {
        type: "",
      };

      const nextState = messageReducer(initState, action);
      expect(nextState).toEqual({
        type: "",
        title: "",
        text: "",
      });
    });
  });

  describe("handleSuccessMessage", () => {
    const dispatch = jest.fn();
    const mockRes = { data: { message: "資料更新成功" } };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    test("更新成功訊息 3秒後消除訊息", () => {
      handleSuccessMessage(dispatch, mockRes);

      expect(dispatch).toHaveBeenCalledWith({
        type: "POST_MESSAGE",
        payload: {
          type: "success",
          title: "更新成功",
          text: "資料更新成功",
        },
      });

      jest.advanceTimersByTime(3000);

      expect(dispatch).toHaveBeenCalledWith({
        type: "CLEAR_MESSAGE",
      });
    });
  });

  describe("handleErrorMessage", () => {
    const dispatch = jest.fn();
    const mockErrorArray = {
      response: { data: { message: ["err1", "err2"] } },
    };
    const mockError = {
      response: { data: { message: "err1" } },
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    test("陣列的更新失敗訊息 3秒後消除訊息", () => {
      handleErrorMessage(dispatch, mockErrorArray);

      expect(dispatch).toHaveBeenCalledWith({
        type: "POST_MESSAGE",
        payload: {
          type: "danger",
          title: "失敗",
          text: "err1、err2",
        },
      });

      jest.advanceTimersByTime(3000);

      expect(dispatch).toHaveBeenCalledWith({
        type: "CLEAR_MESSAGE",
      });
    });

    test("更新失敗訊息 3秒後消除訊息", () => {
      handleErrorMessage(dispatch, mockError);

      expect(dispatch).toHaveBeenCalledWith({
        type: "POST_MESSAGE",
        payload: {
          type: "danger",
          title: "失敗",
          text: "err1",
        },
      });

      jest.advanceTimersByTime(3000);

      expect(dispatch).toHaveBeenCalledWith({
        type: "CLEAR_MESSAGE",
      });
    });
  });
});
