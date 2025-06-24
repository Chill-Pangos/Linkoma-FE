import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
  Typography,
  DatePicker,
  Select,
  Input,
  Modal,
  Descriptions,
  Progress,
  message,
  Tooltip
} from 'antd';
import {
  DollarOutlined,
  CalendarOutlined,
  SearchOutlined,
  EyeOutlined,
  CreditCardOutlined,
  WalletOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ResidentBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billDetailVisible, setBillDetailVisible] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: [dayjs().subtract(6, 'months'), dayjs()],
    status: 'all',
    type: 'all'
  });

  // Mock data - thay thế bằng dữ liệu thực từ API
  const mockBills = [
    {
      id: 'HD001',
      month: '2024-01',
      type: 'Phí quản lý',
      amount: 1500000,
      status: 'paid',
      dueDate: '2024-01-15',
      paidDate: '2024-01-10',
      apartment: 'A101',
      details: {
        managementFee: 800000,
        parkingFee: 200000,
        waterFee: 300000,
        electricityFee: 200000
      }
    },
    {
      id: 'HD002',
      month: '2024-02',
      type: 'Phí quản lý',
      amount: 1650000,
      status: 'overdue',
      dueDate: '2024-02-15',
      paidDate: null,
      apartment: 'A101',
      details: {
        managementFee: 800000,
        parkingFee: 200000,
        waterFee: 350000,
        electricityFee: 250000,
        lateFee: 50000
      }
    },
    {
      id: 'HD003',
      month: '2024-03',
      type: 'Phí quản lý',
      amount: 1400000,
      status: 'pending',
      dueDate: '2024-03-15',
      paidDate: null,
      apartment: 'A101',
      details: {
        managementFee: 800000,
        parkingFee: 200000,
        waterFee: 250000,
        electricityFee: 150000
      }
    },
    {
      id: 'HD004',
      month: '2024-02',
      type: 'Phí dịch vụ',
      amount: 500000,
      status: 'paid',
      dueDate: '2024-02-20',
      paidDate: '2024-02-18',
      apartment: 'A101',
      details: {
        cleaningService: 300000,
        securityService: 200000
      }
    }
  ];

  useEffect(() => {
    fetchBills();
  }, [filters]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredBills = [...mockBills];
      
      // Filter by date range
      if (filters.dateRange) {
        filteredBills = filteredBills.filter(bill => {
          const billDate = dayjs(bill.month);
          return billDate.isBetween(filters.dateRange[0], filters.dateRange[1], 'month', '[]');
        });
      }
      
      // Filter by status
      if (filters.status !== 'all') {
        filteredBills = filteredBills.filter(bill => bill.status === filters.status);
      }
      
      // Filter by type
      if (filters.type !== 'all') {
        filteredBills = filteredBills.filter(bill => bill.type === filters.type);
      }
      
      setBills(filteredBills);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return { color: 'success', icon: <CheckCircleOutlined />, text: 'Đã thanh toán' };
      case 'pending':
        return { color: 'warning', icon: <ClockCircleOutlined />, text: 'Chờ thanh toán' };
      case 'overdue':
        return { color: 'error', icon: <AlertOutlined />, text: 'Quá hạn' };
      default:
        return { color: 'default', icon: null, text: status };
    }
  };

  const handleViewDetail = (bill) => {
    setSelectedBill(bill);
    setBillDetailVisible(true);
  };

  const handlePayBill = (billId) => {
    Modal.confirm({
      title: 'Xác nhận thanh toán',
      content: 'Bạn có chắc chắn muốn thanh toán hóa đơn này?',
      onOk: async () => {
        try {
          // API call to process payment
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setBills(bills.map(bill => 
            bill.id === billId 
              ? { ...bill, status: 'paid', paidDate: dayjs().format('YYYY-MM-DD') }
              : bill
          ));
          
          message.success('Thanh toán thành công!');
        } catch (error) {
          message.error('Thanh toán thất bại!');
        }
      }
    });
  };

  const handleDownloadBill = (bill) => {
    // Simulate download
    message.success(`Đang tải hóa đơn ${bill.id}...`);
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      width: 100,
      render: (text) => dayjs(text).format('MM/YYYY')
    },
    {
      title: 'Loại hóa đơn',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: '#1890ff' }}>
          {amount.toLocaleString('vi-VN')} đ
        </Text>
      )
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.status !== 'paid' && (
            <Tooltip title="Thanh toán">
              <Button
                type="primary"
                size="small"
                icon={<CreditCardOutlined />}
                onClick={() => handlePayBill(record.id)}
              >
                Thanh toán
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Tải xuống">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadBill(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Calculate statistics
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const overdueCount = bills.filter(bill => bill.status === 'overdue').length;

  return (
    <div className="resident-bills">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          <WalletOutlined style={{ marginRight: 8 }} />
          Quản lý hóa đơn
        </Title>
        <Text type="secondary">Theo dõi và thanh toán các hóa đơn phí</Text>
      </div>

      {/* Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng tiền"
              value={totalAmount}
              suffix="đ"
              formatter={(value) => value.toLocaleString('vi-VN')}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={paidAmount}
              suffix="đ"
              formatter={(value) => value.toLocaleString('vi-VN')}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Chưa thanh toán"
              value={unpaidAmount}
              suffix="đ"
              formatter={(value) => value.toLocaleString('vi-VN')}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Quá hạn"
              value={overdueCount}
              suffix="hóa đơn"
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={8}>
            <label style={{ display: 'block', marginBottom: 8 }}>Khoảng thời gian:</label>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
              picker="month"
              format="MM/YYYY"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <label style={{ display: 'block', marginBottom: 8 }}>Trạng thái:</label>
            <Select
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="paid">Đã thanh toán</Option>
              <Option value="pending">Chờ thanh toán</Option>
              <Option value="overdue">Quá hạn</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <label style={{ display: 'block', marginBottom: 8 }}>Loại hóa đơn:</label>
            <Select
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
              style={{ width: '100%' }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="Phí quản lý">Phí quản lý</Option>
              <Option value="Phí dịch vụ">Phí dịch vụ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={fetchBills}
              loading={loading}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Bảng hóa đơn */}
      <Card>
        <Table
          columns={columns}
          dataSource={bills}
          rowKey="id"
          loading={loading}
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} hóa đơn`
          }}
        />
      </Card>

      {/* Modal chi tiết hóa đơn */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            Chi tiết hóa đơn {selectedBill?.id}
          </Space>
        }
        open={billDetailVisible}
        onCancel={() => setBillDetailVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={() => handleDownloadBill(selectedBill)}>
            Tải xuống
          </Button>,
          selectedBill?.status !== 'paid' && (
            <Button
              key="pay"
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => {
                handlePayBill(selectedBill.id);
                setBillDetailVisible(false);
              }}
            >
              Thanh toán
            </Button>
          ),
          <Button key="close" onClick={() => setBillDetailVisible(false)}>
            Đóng
          </Button>
        ].filter(Boolean)}
        width={600}
      >
        {selectedBill && (
          <div>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã hóa đơn" span={2}>
                <Text strong>{selectedBill.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tháng">
                {dayjs(selectedBill.month).format('MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Loại hóa đơn">
                <Tag color="blue">{selectedBill.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Căn hộ">
                {selectedBill.apartment}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {(() => {
                  const config = getStatusConfig(selectedBill.status);
                  return (
                    <Tag color={config.color} icon={config.icon}>
                      {config.text}
                    </Tag>
                  );
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn thanh toán">
                {dayjs(selectedBill.dueDate).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày thanh toán">
                {selectedBill.paidDate ? dayjs(selectedBill.paidDate).format('DD/MM/YYYY') : 'Chưa thanh toán'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Chi tiết các khoản phí:</Title>
              <div style={{ background: '#fafafa', padding: 16, borderRadius: 8 }}>
                {Object.entries(selectedBill.details).map(([key, value]) => {
                  const labels = {
                    managementFee: 'Phí quản lý',
                    parkingFee: 'Phí gửi xe',
                    waterFee: 'Tiền nước',
                    electricityFee: 'Tiền điện',
                    cleaningService: 'Dịch vụ vệ sinh',
                    securityService: 'Dịch vụ bảo vệ',
                    lateFee: 'Phí trễ hạn'
                  };
                  
                  return (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text>{labels[key] || key}:</Text>
                      <Text strong style={{ color: key === 'lateFee' ? '#ff4d4f' : '#1890ff' }}>
                        {value.toLocaleString('vi-VN')} đ
                      </Text>
                    </div>
                  );
                })}
                <div style={{ borderTop: '1px solid #d9d9d9', paddingTop: 8, marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Tổng cộng:</Text>
                    <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                      {selectedBill.amount.toLocaleString('vi-VN')} đ
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResidentBills;
