import reducer, {
  createMessage,
  removeMessage,
  createAsyncMessage,
} from "./messageSlice";

describe("messageSlice單元測試", () => {
  describe("reducers", () => {
    const initialState = [];

    test("createMessage", () => {
      const nextState = reducer(
        initialState,
        createMessage({
          id: 1,
          message: "加入成功",
          success: true,
        })
      );
      expect(nextState).toEqual([
        {
          id: 1,
          type: "success",
          title: "成功",
          message: "加入成功",
        },
      ]);
    });

    test("createMessage ActionSuccess狀態為false", () => {
      const nextState = reducer(
        initialState,
        createMessage({
          id: 1,
          message: "加入失敗",
        })
      );
      expect(nextState).toEqual([
        {
          id: 1,
          type: "danger",
          title: "錯誤",
          message: "加入失敗",
        },
      ]);
    });

    test("removeMessage", () => {
      const initialState = [
        {
          id: 1,
          type: "success",
          title: "成功",
          message: "加入成功",
        },
        {
          id: 2,
          type: "success",
          title: "成功",
          message: "加入成功",
        },
      ];
      const nextState = reducer(initialState, removeMessage(1));
      expect(nextState).toEqual([
        {
          id: 2,
          type: "success",
          title: "成功",
          message: "加入成功",
        },
      ]);
    });
  });

  describe("createAsyncThunk", () => {
    const mockDispatch = jest.fn(); //模擬 dispatch 函式
    const mockRequestId = "test-id";

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("createAsyncMessage", async () => {
      await createAsyncMessage({
        message: "加入成功",
        success: true,
      })(mockDispatch, null, mockRequestId);

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "message/createMessage",
          payload: {
            id: expect.anything(),
            message: "加入成功",
            success: true,
          },
        })
      );

      jest.runAllTimers();

      expect(mockDispatch.mock.calls[3][0]).toEqual(
        expect.objectContaining({
          type: "message/removeMessage",
          payload: expect.anything(),
        })
      );
    });
  });
});
