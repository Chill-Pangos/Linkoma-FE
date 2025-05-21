import { Button } from "antd";

const AddUserButton = ({ onAdd }) => (
  <div style={{ textAlign: "right", marginBottom: 16 }}>
    <Button type="primary" onClick={onAdd}>+ Thêm mới</Button>
  </div>
);

export default AddUserButton;
