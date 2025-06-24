import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getRedirectPath } from "../../utils/routeUtils";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await login({
        email: values.email,
        password: values.password,
      });

      message.success("Đăng nhập thành công!");

      // Redirect dựa trên role của user
      const intendedPath = location.state?.from?.pathname;
      const redirectPath = getRedirectPath(response.user, intendedPath);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#f7f9fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/src/assets/BG.png')",
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          width: 400,
          backgroundColor: "white",
          padding: 40,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src="/src/assets/LINKOMA_WEB_LOGO_HORIZONTAL.png"
          alt="logo"
          style={{ width: 280, marginBottom: 20 }}
        />
        <Title
          level={3}
          style={{
            marginBottom: 8,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "600",
          }}
        >
          Đăng nhập hệ thống
        </Title>
        <Text
          type="secondary"
          style={{
            display: "block",
            marginBottom: 30,
            fontSize: "14px",
          }}
        >
          Kết nối số với mái ấm của bạn
        </Text>{" "}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              placeholder="Email"
              style={{
                borderRadius: "8px",
                height: "45px",
                fontSize: "14px",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#1890ff" }} />}
              placeholder="Mật khẩu"
              style={{
                borderRadius: "8px",
                height: "45px",
                fontSize: "14px",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ fontSize: "14px" }}>
                  Ghi nhớ tài khoản
                </Checkbox>
              </Form.Item>
              <Link
                to="/forgot-password"
                style={{
                  color: "#1890ff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Quên mật khẩu?
              </Link>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: "20px" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "8px",
                height: "45px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>

          <div
            style={{
              padding: "16px 0",
              borderTop: "1px solid #f0f0f0",
              marginTop: "20px",
            }}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Tài khoản demo: <Text strong>tuandt1409@gmail.com</Text> /{" "}
              <Text strong>tuan1234</Text>
            </Text>
          </div>
        </Form>
        <div style={{ marginTop: 20 }}>
          <Text
            type="secondary"
            style={{ fontSize: "12px", lineHeight: "1.5" }}
          >
            Bạn chưa có tài khoản? Liên hệ ban quản lý để được hỗ trợ đăng ký
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
