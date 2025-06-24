import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Result,
} from "antd";
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setEmail(values.email);
    
    // Simulate API call to send reset email
    try {
      // Replace with actual API call
      setTimeout(() => {
        setLoading(false);
        setEmailSent(true);
        message.success('Email khôi phục mật khẩu đã được gửi!');
      }, 2000);
    } catch (error) {
      setLoading(false);
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  if (emailSent) {
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
          <Result
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Email đã được gửi!"
            subTitle={
              <div>
                <Text>
                  Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email:
                </Text>
                <br />
                <Text strong style={{ color: '#1890ff' }}>{email}</Text>
                <br />
                <br />
                <Text type="secondary">
                  Vui lòng kiểm tra hộp thư (bao gồm cả thư rác) và làm theo hướng dẫn để đặt lại mật khẩu.
                </Text>
              </div>
            }
            extra={[
              <Button 
                type="primary" 
                key="back-to-login"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
                  <ArrowLeftOutlined /> Quay lại đăng nhập
                </Link>
              </Button>,
              <Button 
                key="resend" 
                onClick={() => setEmailSent(false)}
                style={{
                  marginTop: '12px',
                  borderRadius: '8px',
                  height: '40px'
                }}
              >
                Gửi lại email
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

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
          Quên mật khẩu?
        </Title>
        
        <Text type="secondary" style={{ 
          display: 'block', 
          marginBottom: 30,
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu
        </Text>

        <Form
          name="forgot-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#1890ff' }} />}
              placeholder="Nhập địa chỉ email của bạn"
              style={{
                borderRadius: '8px',
                height: '45px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '20px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
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
              {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
            </Button>
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Link 
              to="/login" 
              style={{ 
                color: '#1890ff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <ArrowLeftOutlined style={{ marginRight: '6px' }} />
              Quay lại đăng nhập
            </Link>
          </Space>
        </Form>

        <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Bạn chưa có tài khoản? Liên hệ ban quản lý để được hỗ trợ
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
