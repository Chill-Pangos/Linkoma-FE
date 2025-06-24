import React from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Space,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const Login = () => {
  const onFinish = (values) => {
    console.log("Login info:", values);
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
        
        <Title level={3} style={{ 
          marginBottom: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '600'
        }}>
          Đăng nhập hệ thống
        </Title>
        
        <Text type="secondary" style={{ 
          display: 'block', 
          marginBottom: 30,
          fontSize: '14px'
        }}>
          Kết nối số với mái ấm của bạn
        </Text>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="Tên tài khoản"
              style={{
                borderRadius: '8px',
                height: '45px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Mật khẩu"
              style={{
                borderRadius: '8px',
                height: '45px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '20px' }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ fontSize: '14px' }}>Ghi nhớ tài khoản</Checkbox>
              </Form.Item>
              <Link 
                to="/forgot-password"
                style={{ 
                  color: '#1890ff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Quên mật khẩu?
              </Link>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: '20px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '45px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ 
            padding: '16px 0',
            borderTop: '1px solid #f0f0f0',
            marginTop: '20px'
          }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Tài khoản demo: <Text strong>admin</Text> / <Text strong>linkoma123</Text>
            </Text>
          </div>
        </Form>

        <div style={{ marginTop: 20 }}>
          <Text type="secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>
            Bạn chưa có tài khoản? Liên hệ ban quản lý để được hỗ trợ đăng ký
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
