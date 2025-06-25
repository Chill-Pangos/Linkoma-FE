import React, { useState } from "react";
import { Modal, Form, Input, message, Typography } from "antd";
import { MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { userService } from "../../../services";

const { Text } = Typography;

const QuickCreateUserModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await userService.createUserWithEmail(values.email);

      message.success(
        `Tài khoản đã được tạo thành công! ID: ${response.userId || "N/A"}`
      );

      form.resetFields();
      onSuccess(); // Reload user list
      onCancel(); // Close modal
    } catch (error) {
      console.error("Error creating user with email:", error);
      message.error("Không thể tạo tài khoản! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserAddOutlined style={{ color: "#1890ff" }} />
          <span>⚡ Tạo Tài Khoản Nhanh</span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Tạo tài khoản"
      cancelText="Hủy"
      width={500}
      destroyOnClose
    >
      <div style={{ padding: "16px 0" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #d1ecf1",
          }}
        >
          <Text type="secondary" style={{ fontSize: "14px" }}>
            💡 <strong>Tạo nhanh:</strong> Chỉ cần nhập email, hệ thống sẽ tự
            động tạo tài khoản với thông tin cơ bản. Bạn có thể cập nhật thông
            tin chi tiết sau.
          </Text>
        </div>

        <Form form={form} layout="vertical" size="large">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            hasFeedback
          >
            <Input
              prefix={<MailOutlined style={{ color: "#1890ff" }} />}
              placeholder="example@email.com"
              size="large"
              style={{ borderRadius: "8px" }}
            />
          </Form.Item>
        </Form>

        <div
          style={{
            background: "#fff7e6",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ffd591",
            marginTop: "16px",
          }}
        >
          <Text style={{ fontSize: "12px", color: "#d46b08" }}>
            ⚠️ <strong>Lưu ý:</strong> Tài khoản được tạo sẽ có role mặc định là
            "resident". Bạn có thể thay đổi role và cập nhật thông tin chi tiết
            trong màn hình chỉnh sửa.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default QuickCreateUserModal;
