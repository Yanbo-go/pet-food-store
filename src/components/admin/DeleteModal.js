function DeleteModal({ closeDeleteModal, deleteFn, deleteData }) {
  const { id } = deleteData;
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="deleteModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger">
            <h1 className="modal-title text-white fs-5" id="exampleModalLabel">
              刪除確認
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeDeleteModal}
            />
          </div>
          <div className="modal-body">確定刪除嗎?</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteFn(id);
              }}
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
