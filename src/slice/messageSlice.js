import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "message",
  initialState: [],
  reducers: {
    createMessage(state, action) {
      console.log(action);
      if (action.payload.success) {
        state.push({
          id: action.payload.id,
          type: "success",
          title: "成功",
          message: action.payload.message,
        });
      } else {
        state.push({
          id: action.payload.id,
          type: "danger",
          title: "錯誤",
          message: Array.isArray(action.payload?.message)
            ? action.payload?.message.join("、")
            : action.payload?.message,
        });
      }
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const createAsyncMessage = createAsyncThunk(
  "message/createAsyncMessage",
  (payload, { dispatch, requestId }) => {
    dispatch(
      messageSlice.actions.createMessage({
        ...payload,
        id: requestId,
      })
    );

    setTimeout(() => {
      dispatch(messageSlice.actions.removeMessage(requestId));
    }, 3000);
  }
);

export const { createMessage, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
