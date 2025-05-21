import React from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Tabs,
  Typography,
  Space,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

const Login = () => {
  const onFinish = (values) => {
    console.log("Login info:", values);
  };

  return (
    <div
      style={{
              minHeight: "100vh",
          minWidth:"100vw",
        backgroundColor: "#f7f9fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/src/assets/BG.png')", // nếu bạn muốn thêm ảnh nền
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          width: 360,
          backgroundColor: "white",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <img
          src="/src/assets/LINKOMA_WEB_LOGO_HORIZONTAL.png" // bạn thay logo tương ứng
          alt="logo"
          style={{ width: 250, marginBottom: 0}}
        />
        <Title level={5} style={{ marginBottom: 20 }}>
          Kết nối số với mái ấm của bạn
        </Title>

        {/* Tabs */}
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đăng nhập" key="1">
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Nhập tên tài khoản!" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="tên tài khoản: admin / user / ..."
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="mật khẩu: linkoma..."
                />
              </Form.Item>

              <Form.Item>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Ghi nhớ tài khoản</Checkbox>
                  </Form.Item>
                  <Link href="#">Quên mật khẩu</Link>
                </Space>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Đăng nhập
                </Button>
              </Form.Item>

              <div>
                <Text>Đăng nhập nhanh:</Text> <Link href="#">Đăng ký</Link>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Đăng ký" key="2">
            <Text>Chức năng đăng ký đang được phát triển...</Text>
          </TabPane>
        </Tabs>

        <div style={{ marginTop: 30 }}>
          <Text type="secondary">Thông tin chung cư: ... ... ...</Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
