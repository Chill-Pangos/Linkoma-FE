import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  message,
  Result,
  Progress,
} from "antd";
import { 
  LockOutlined, 
  CheckCircleOutlined, 
  EyeInvisibleOutlined, 
  EyeTwoTone,
  ExclamationCircleOutlined 
} from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    // Validate token when component mounts
    if (token && email) {
      validateToken();
    } else {
      setTokenValid(false);
    }
  }, [token, email]);

  const validateToken = async () => {
    try {
      // Replace with actual API call to validate token
      setTimeout(() => {
        // Simulate token validation
        setTokenValid(true);
      }, 1000);
    } catch (error) {
      setTokenValid(false);
      message.error('Token không hợp lệ hoặc đã hết hạn!');
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const onPasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return '#ff4d4f';
    if (passwordStrength <= 50) return '#fa8c16';
    if (passwordStrength <= 75) return '#fadb14';
    return '#52c41a';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Yếu';
    if (passwordStrength <= 50) return 'Trung bình';
    if (passwordStrength <= 75) return 'Mạnh';
    return 'Rất mạnh';
  };

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // Replace with actual API call to reset password
      setTimeout(() => {
        setLoading(false);
        setPasswordReset(true);
        message.success('Mật khẩu đã được đặt lại thành công!');
      }, 2000);
    } catch (error) {
      setLoading(false);
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  // Invalid token or missing parameters
  if (tokenValid === false) {
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
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Liên kết không hợp lệ"
            subTitle="Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới."
            extra={[
              <Button 
                type="primary"
                key="forgot-password"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  height: '40px'
                }}
              >
                <Link to="/forgot-password" style={{ color: 'white', textDecoration: 'none' }}>
                  Quên mật khẩu
                </Link>
              </Button>,
              <Button key="login">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  Đăng nhập
                </Link>
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: "#f7f9fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          <Title level={4}>Đang xác thực...</Title>
          <Text type="secondary">Vui lòng chờ trong giây lát</Text>
        </div>
      </div>
    );
  }

  // Password reset successful
  if (passwordReset) {
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
            title="Đặt lại mật khẩu thành công!"
            subTitle="Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới."
            extra={[
              <Button 
                type="primary"
                key="login"
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
                  Đăng nhập ngay
                </Link>
              </Button>
            ]}
          />
        </div>
      </div>
    );
  }

  // Reset password form
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
          width: 450,
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
          Đặt lại mật khẩu
        </Title>
        
        <Text type="secondary" style={{ 
          display: 'block', 
          marginBottom: 30,
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Tạo mật khẩu mới cho tài khoản: <Text strong style={{ color: '#1890ff' }}>{email}</Text>
        </Text>

        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!"
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Nhập mật khẩu mới"
              onChange={onPasswordChange}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              style={{
                borderRadius: '8px',
                height: '45px',
                fontSize: '14px'
              }}
            />
          </Form.Item>

          {/* Password Strength Indicator */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <Text style={{ fontSize: '12px', color: '#666' }}>Độ mạnh mật khẩu:</Text>
            <Progress
              percent={passwordStrength}
              strokeColor={getPasswordStrengthColor()}
              showInfo={false}
              size="small"
              style={{ marginBottom: '4px' }}
            />
            <Text style={{ 
              fontSize: '12px', 
              color: getPasswordStrengthColor(),
              fontWeight: '500'
            }}>
              {getPasswordStrengthText()}
            </Text>
          </div>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Xác nhận mật khẩu mới"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
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
              Quay lại đăng nhập
            </Link>
          </Space>
        </Form>

        <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Lời khuyên: Sử dụng mật khẩu mạnh và không chia sẻ với người khác
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
