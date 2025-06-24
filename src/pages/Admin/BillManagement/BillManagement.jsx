import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Popconfirm,
  message,
  Typography,
  InputNumber,
  Descriptions,
  Divider,
  Badge,
  Tooltip,
  Progress,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  PrinterOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CreditCardOutlined,
  MoneyCollectOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BillManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [viewingBill, setViewingBill] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Dữ liệu mẫu hóa đơn
  const [bills, setBills] = useState([
    {
      id: '1',
      billNumber: 'HD001-2024',
      apartment: 'A101',
      resident: 'Nguyễn Văn An',
      month: '2024-06',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      status: 'paid',
      services: [
        { name: 'Điện', usage: 150, price: 3500, total: 525000 },
        { name: 'Nước', usage: 15, price: 25000, total: 375000 },
        { name: 'Internet', usage: 1, price: 200000, total: 200000 },
        { name: 'Quản lý', usage: 65, price: 15000, total: 975000 },
      ],
      totalAmount: 2075000,
      paidAmount: 2075000,
      paidDate: '2024-06-10',
      paymentMethod: 'transfer',
    },
    {
      id: '2',
      billNumber: 'HD002-2024',
      apartment: 'B205',
      resident: 'Trần Thị Bình',
      month: '2024-06',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      status: 'unpaid',
      services: [
        { name: 'Điện', usage: 180, price: 3500, total: 630000 },
        { name: 'Nước', usage: 20, price: 25000, total: 500000 },
        { name: 'Quản lý', usage: 70, price: 15000, total: 1050000 },
        { name: 'Gửi xe máy', usage: 1, price: 100000, total: 100000 },
      ],
      totalAmount: 2280000,
      paidAmount: 0,
      paidDate: null,
      paymentMethod: null,
    },
    {
      id: '3',
      billNumber: 'HD003-2024',
      apartment: 'C304',
      resident: 'Lê Văn Cường',
      month: '2024-06',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      status: 'overdue',
      services: [
        { name: 'Điện', usage: 120, price: 3500, total: 420000 },
        { name: 'Nước', usage: 12, price: 25000, total: 300000 },
        { name: 'Internet', usage: 1, price: 200000, total: 200000 },
        { name: 'Quản lý', usage: 75, price: 15000, total: 1125000 },
      ],
      totalAmount: 2045000,
      paidAmount: 0,
      paidDate: null,
      paymentMethod: null,
    },
    {
      id: '4',
      billNumber: 'HD004-2024',
      apartment: 'A203',
      resident: 'Phạm Thị Dung',
      month: '2024-06',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      status: 'partial',
      services: [
        { name: 'Điện', usage: 160, price: 3500, total: 560000 },
        { name: 'Nước', usage: 18, price: 25000, total: 450000 },
        { name: 'Internet', usage: 1, price: 200000, total: 200000 },
        { name: 'Quản lý', usage: 68, price: 15000, total: 1020000 },
        { name: 'Bảo vệ', usage: 1, price: 80000, total: 80000 },
      ],
      totalAmount: 2310000,
      paidAmount: 1500000,
      paidDate: '2024-06-12',
      paymentMethod: 'cash',
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'unpaid': return 'orange';
      case 'overdue': return 'red';
      case 'partial': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'unpaid': return 'Chưa thanh toán';
      case 'overdue': return 'Quá hạn';
      case 'partial': return 'Thanh toán một phần';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleOutlined />;
      case 'unpaid': return <ClockCircleOutlined />;
      case 'overdue': return <ExclamationCircleOutlined />;
      case 'partial': return <ClockCircleOutlined />;
      default: return <FileTextOutlined />;
    }
  };

  const columns = [
    {
      title: 'Hóa đơn',
      key: 'billInfo',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '16px' }}>{record.billNumber}</Text>
          <br />
          <Text type="secondary">{dayjs(record.month).format('MM/YYYY')}</Text>
        </div>
      ),
    },
    {
      title: 'Căn hộ',
      key: 'apartmentInfo',
      sorter: (a, b) => a.apartment.localeCompare(b.apartment),
      render: (_, record) => (
        <div>
          <Text strong>{record.apartment}</Text>
          <br />
          <Text type="secondary">{record.resident}</Text>
        </div>
      ),
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date, record) => {
        const isOverdue = dayjs().isAfter(dayjs(date)) && record.status !== 'paid';
        return (
          <Text style={{ color: isOverdue ? '#f5222d' : 'inherit' }}>
            {dayjs(date).format('DD/MM/YYYY')}
          </Text>
        );
      },
    },
    {
      title: 'Số tiền',
      key: 'amount',
      align: 'right',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
            {record.totalAmount.toLocaleString()}
          </Text>
          <br />
          {record.status === 'partial' && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Đã trả: {record.paidAmount.toLocaleString()}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Đã thanh toán', value: 'paid' },
        { text: 'Chưa thanh toán', value: 'unpaid' },
        { text: 'Quá hạn', value: 'overdue' },
        { text: 'Thanh toán một phần', value: 'partial' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewBill(record)}
            >
              Xem
            </Button>
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditBill(record)}
            >
              Sửa
            </Button>
          </Space>
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => handlePrintBill(record)}
            >
              In
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xóa hóa đơn này?"
              onConfirm={() => handleDeleteBill(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        </Space>
      ),
    },
  ];

  const handleAddBill = () => {
    setEditingBill(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    form.setFieldsValue({
      ...bill,
      issueDate: dayjs(bill.issueDate),
      dueDate: dayjs(bill.dueDate),
      paidDate: bill.paidDate ? dayjs(bill.paidDate) : null,
    });
    setModalVisible(true);
  };

  const handleViewBill = (bill) => {
    setViewingBill(bill);
    setViewModalVisible(true);
  };

  const handlePrintBill = (bill) => {
    message.info(`Đang in hóa đơn ${bill.billNumber}...`);
    // Logic in hóa đơn
  };

  const handleDeleteBill = (id) => {
    setBills(bills.filter(b => b.id !== id));
    message.success('Đã xóa hóa đơn thành công!');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      setTimeout(() => {
        if (editingBill) {
          setBills(bills.map(b => 
            b.id === editingBill.id 
              ? { 
                  ...b, 
                  ...values,
                  issueDate: values.issueDate.format('YYYY-MM-DD'),
                  dueDate: values.dueDate.format('YYYY-MM-DD'),
                  paidDate: values.paidDate ? values.paidDate.format('YYYY-MM-DD') : null,
                }
              : b
          ));
          message.success('Cập nhật hóa đơn thành công!');
        } else {
          const newBill = {
            id: Date.now().toString(),
            billNumber: `HD${Date.now().toString().slice(-3)}-2024`,
            ...values,
            issueDate: values.issueDate.format('YYYY-MM-DD'),
            dueDate: values.dueDate.format('YYYY-MM-DD'),
            paidDate: values.paidDate ? values.paidDate.format('YYYY-MM-DD') : null,
            services: [],
          };
          setBills([...bills, newBill]);
          message.success('Tạo hóa đơn mới thành công!');
        }
        
        setModalVisible(false);
        setLoading(false);
        form.resetFields();
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.billNumber.toLowerCase().includes(searchText.toLowerCase()) ||
    bill.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
    bill.resident.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalBills = bills.length;
  const paidBills = bills.filter(b => b.status === 'paid').length;
  const unpaidBills = bills.filter(b => b.status === 'unpaid').length;
  const overdueBills = bills.filter(b => b.status === 'overdue').length;
  const totalRevenue = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.paidAmount, 0);
  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header với gradient */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
            borderRadius: '12px',
            padding: '12px',
            marginRight: '16px'
          }}>
            <DollarOutlined style={{ fontSize: '24px', color: 'white' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Quản Lý Hóa Đơn
            </Title>
            <Text type="secondary">Quản lý hóa đơn và thanh toán của cư dân</Text>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan với gradient cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng Hóa Đơn</span>}
              value={totalBills}
              prefix={<FileTextOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>hóa đơn</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Đã Thanh Toán</span>}
              value={paidBills}
              prefix={<CheckCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>hóa đơn</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Chưa Thanh Toán</span>}
              value={unpaidBills + overdueBills}
              prefix={<ClockCircleOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>hóa đơn</span>}
            />
          </Card>
        </Col>        <Col xs={24} sm={12} lg={6}>
          <Card style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Statistic
              title={<span style={{ color: 'rgba(100,100,100,0.8)' }}>Doanh Thu</span>}
              value={totalRevenue}
              prefix={<span style={{ color: '#666' }}>₫</span>}
              valueStyle={{ color: '#666', fontSize: '28px', fontWeight: 'bold' }}              formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              suffix={<span style={{ color: 'rgba(100,100,100,0.8)', fontSize: '16px' }}>VNĐ</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý hóa đơn */}
      <Card
        style={{
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
              borderRadius: '8px',
              padding: '8px',
              marginRight: '12px'
            }}>
              <FileTextOutlined style={{ color: 'white', fontSize: '16px' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              Danh Sách Hóa Đơn
            </span>
          </div>
        }
        extra={
          <Space>
            <Search
              placeholder="Tìm kiếm hóa đơn..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ minWidth: '300px' }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBill}
              size="large"
              style={{
                background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
              }}
            >
              Tạo Hóa Đơn
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredBills}
          rowKey="id"
          pagination={{
            total: filteredBills.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} hóa đơn`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Modal thêm/sửa hóa đơn */}
      <Modal
        title={editingBill ? '✏️ Sửa Hóa Đơn' : '➕ Tạo Hóa Đơn Mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
        confirmLoading={loading}
        okText={editingBill ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'unpaid',
            month: dayjs().format('YYYY-MM'),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="apartment"
                label="Căn hộ"
                rules={[{ required: true, message: 'Vui lòng chọn căn hộ!' }]}
              >
                <Select placeholder="Chọn căn hộ">
                  <Option value="A101">A101 - Nguyễn Văn An</Option>
                  <Option value="A102">A102 - Trống</Option>
                  <Option value="B201">B201 - Trần Thị Bình</Option>
                  <Option value="B202">B202 - Lê Văn Cường</Option>
                  <Option value="C301">C301 - Phạm Thị Dung</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="month"
                label="Tháng/Năm"
                rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
              >
                <DatePicker 
                  picker="month" 
                  style={{ width: '100%' }} 
                  format="MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="issueDate"
                label="Ngày phát hành"
                rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Hạn thanh toán"
                rules={[{ required: true, message: 'Vui lòng chọn hạn thanh toán!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="totalAmount"
                label="Tổng tiền (VNĐ)"
                rules={[{ required: true, message: 'Vui lòng nhập tổng tiền!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
              >
                <Select>
                  <Option value="unpaid">Chưa thanh toán</Option>
                  <Option value="paid">Đã thanh toán</Option>
                  <Option value="partial">Thanh toán một phần</Option>
                  <Option value="overdue">Quá hạn</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="paymentMethod"
                label="Phương thức TT"
              >
                <Select placeholder="Chọn phương thức">
                  <Option value="cash">Tiền mặt</Option>
                  <Option value="transfer">Chuyển khoản</Option>
                  <Option value="card">Thẻ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="paidAmount"
                label="Số tiền đã trả"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="paidDate"
                label="Ngày thanh toán"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal xem chi tiết hóa đơn */}
      <Modal
        title="🧾 Chi Tiết Hóa Đơn"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="print" 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={() => handlePrintBill(viewingBill)}
          >
            In hóa đơn
          </Button>,
        ]}
        width={800}
      >
        {viewingBill && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={3}>{viewingBill.billNumber}</Title>
              <Tag color={getStatusColor(viewingBill.status)} style={{ fontSize: '14px' }}>
                {getStatusText(viewingBill.status)}
              </Tag>
            </div>

            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Căn hộ">
                {viewingBill.apartment}
              </Descriptions.Item>
              <Descriptions.Item label="Cư dân">
                {viewingBill.resident}
              </Descriptions.Item>
              <Descriptions.Item label="Tháng">
                {dayjs(viewingBill.month).format('MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày phát hành">
                {dayjs(viewingBill.issueDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn thanh toán">
                {dayjs(viewingBill.dueDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức TT">
                {viewingBill.paymentMethod === 'cash' ? 'Tiền mặt' :
                 viewingBill.paymentMethod === 'transfer' ? 'Chuyển khoản' :
                 viewingBill.paymentMethod === 'card' ? 'Thẻ' : 'Chưa xác định'}
              </Descriptions.Item>
            </Descriptions>

            <Title level={4}>Chi tiết dịch vụ:</Title>
            <Table
              size="small"
              dataSource={viewingBill.services}
              pagination={false}
              columns={[
                {
                  title: 'Dịch vụ',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Sử dụng',
                  dataIndex: 'usage',
                  key: 'usage',
                  align: 'center',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  align: 'right',
                  render: (price) => `${price.toLocaleString()} VNĐ`,
                },
                {
                  title: 'Thành tiền',
                  dataIndex: 'total',
                  key: 'total',
                  align: 'right',
                  render: (total) => (
                    <Text strong style={{ color: '#52c41a' }}>
                      {total.toLocaleString()} VNĐ
                    </Text>
                  ),
                },
              ]}
            />

            <Divider />
            
            <Row justify="end">
              <Col>
                <div style={{ textAlign: 'right' }}>
                  <Title level={4} style={{ marginBottom: '8px' }}>
                    Tổng cộng: {' '}
                    <Text style={{ color: '#52c41a' }}>
                      {viewingBill.totalAmount.toLocaleString()} VNĐ
                    </Text>
                  </Title>
                  {viewingBill.status === 'partial' && (
                    <>
                      <Text>Đã thanh toán: {viewingBill.paidAmount.toLocaleString()} VNĐ</Text>
                      <br />
                      <Text strong style={{ color: '#f5222d' }}>
                        Còn lại: {(viewingBill.totalAmount - viewingBill.paidAmount).toLocaleString()} VNĐ
                      </Text>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BillManagement;
