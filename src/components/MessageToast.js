import { useSelector } from "react-redux";

function Message() {
  const messages = useSelector((state) => state.message);

  return (
    <>
      <div
        className="toast-container position-fixed"
        style={{ top: "60px", right: "65px" }}
      >
        {messages?.map((msg) => {
          return (
            <div
              className="toast show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              data-delay="3000"
              key={msg.id}
            >
              <div className={`toast-header text-white bg-${msg.type}`}>
                <strong className="me-auto">{msg.title}</strong>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                />
              </div>
              <div className="toast-body">{msg.message}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Message;
