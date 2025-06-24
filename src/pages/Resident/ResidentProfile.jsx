import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Row,
  Col,
  Typography,
  Descriptions,
  Divider,
  Tag,
  Space
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  EditOutlined,
  SaveOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ResidentProfile = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock data - thay thế bằng dữ liệu thực từ API
  const [residentData, setResidentData] = useState({
    id: 'R001',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0123456789',
    apartment: 'A101',
    building: 'Tòa A',
    floor: '10',
    memberCount: 4,
    moveInDate: '2023-01-15',
    contractEndDate: '2025-01-15',
    status: 'Đang sinh sống',
    avatar: null,
    emergencyContact: {
      name: 'Nguyễn Thị Bình',
      relationship: 'Vợ',
      phone: '0987654321'
    },
    vehicleInfo: [
      { type: 'Ô tô', licensePlate: '30A-12345', color: 'Trắng' },
      { type: 'Xe máy', licensePlate: '30B1-67890', color: 'Đen' }
    ]
  });

  useEffect(() => {
    // Load resident data
    form.setFieldsValue(residentData);
  }, [form, residentData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.setFieldsValue(residentData);
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // API call to update profile
      console.log('Updating profile:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResidentData({ ...residentData, ...values });
      setIsEditing(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('Upload ảnh đại diện thành công!');
      setResidentData({ ...residentData, avatar: info.file.response.url });
    } else if (info.file.status === 'error') {
      message.error('Upload ảnh đại diện thất bại!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang sinh sống': return 'green';
      case 'Tạm vắng': return 'orange';
      case 'Đã chuyển đi': return 'red';
      default: return 'default';
    }
  };

  return (
    <div className="resident-profile">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Hồ sơ cá nhân
        </Title>
        <Text type="secondary">Quản lý thông tin cá nhân và cài đặt tài khoản</Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Thông tin cơ bản */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <IdcardOutlined />
                Thông tin cơ bản
              </Space>
            }
            extra={
              !isEditing ? (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Space>
                  <Button onClick={handleCancel}>Hủy</Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={loading}
                    onClick={() => form.submit()}
                  >
                    Lưu
                  </Button>
                </Space>
              )
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              disabled={!isEditing}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                  >
                    <Input prefix={<MailOutlined />} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password
                      placeholder="Để trống nếu không đổi"
                      iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {/* Ảnh đại diện */}
        <Col xs={24} lg={8}>
          <Card title="Ảnh đại diện">
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={residentData.avatar}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <br />
              <Upload
                accept="image/*"
                showUploadList={false}
                onChange={handleAvatarUpload}
                disabled={!isEditing}
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={!isEditing}
                >
                  Tải ảnh lên
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Thông tin căn hộ */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <HomeOutlined />
                Thông tin căn hộ
              </Space>
            }
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã căn hộ">
                <Text strong>{residentData.apartment}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tòa nhà">
                {residentData.building}
              </Descriptions.Item>
              <Descriptions.Item label="Tầng">
                {residentData.floor}
              </Descriptions.Item>
              <Descriptions.Item label="Số thành viên">
                <Tag color="blue">{residentData.memberCount} người</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày chuyển đến">
                {residentData.moveInDate}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn hợp đồng">
                {residentData.contractEndDate}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(residentData.status)}>
                  {residentData.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Liên hệ khẩn cấp */}
        <Col xs={24} lg={12}>
          <Card title="Liên hệ khẩn cấp">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Họ tên">
                {residentData.emergencyContact.name}
              </Descriptions.Item>
              <Descriptions.Item label="Mối quan hệ">
                {residentData.emergencyContact.relationship}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {residentData.emergencyContact.phone}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      {/* Thông tin xe */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Thông tin phương tiện">
            <Row gutter={[16, 16]}>
              {residentData.vehicleInfo.map((vehicle, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card size="small" style={{ background: '#f8f9fa' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Tag color="blue" style={{ marginBottom: 8 }}>
                        {vehicle.type}
                      </Tag>
                      <br />
                      <Text strong style={{ fontSize: '16px' }}>
                        {vehicle.licensePlate}
                      </Text>
                      <br />
                      <Text type="secondary">Màu: {vehicle.color}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResidentProfile;
