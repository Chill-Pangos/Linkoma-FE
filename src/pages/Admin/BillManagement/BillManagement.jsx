import React, { useState, useEffect, useCallback } from "react";
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
} from "antd";
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
} from "@ant-design/icons";
import dayjs from "dayjs";
import { invoiceService } from "../../../services/invoiceService";
import { invoiceDetailService } from "../../../services/invoiceDetailService";
import { apartmentService } from "../../../services/apartmentService";
import CreateInvoiceWithDetailsModal from "./CreateInvoiceWithDetailsModal";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BillManagement = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [viewingBill, setViewingBill] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [bills, setBills] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [form] = Form.useForm();

  // Fetch bills from API
  const fetchBills = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await invoiceService.getAllInvoices({
        limit: 100,
        page: 1,
        sortBy: "createdAt:desc",
        ...params,
      });

      // Transform API data to match UI format
      const transformedBills = response.results.map((invoice) => ({
        id: invoice.invoiceId.toString(),
        billNumber: `HD${String(invoice.invoiceId).padStart(6, "0")}`,
        apartment: `${invoice.apartment?.apartmentType?.typeName || "N/A"}-${
          invoice.apartment?.floor || "N/A"
        }`,
        apartmentId: invoice.apartmentId,
        resident: "Cư dân", // API doesn't provide resident name directly
        month: dayjs(invoice.createdAt).format("YYYY-MM"),
        issueDate: dayjs(invoice.createdAt).format("YYYY-MM-DD"),
        dueDate: invoice.dueDate,
        status: mapApiStatusToUiStatus(invoice.status),
        totalAmount:
          parseFloat(invoice.rentFee) + parseFloat(invoice.serviceFee),
        rentFee: parseFloat(invoice.rentFee),
        serviceFee: parseFloat(invoice.serviceFee),
        paidAmount:
          invoice.status === "Paid"
            ? parseFloat(invoice.rentFee) + parseFloat(invoice.serviceFee)
            : 0,
        paidDate: invoice.status === "Paid" ? invoice.updatedAt : null,
        paymentMethod: null, // API doesn't provide payment method
        invoiceDetails: invoice.invoiceDetails || [],
      }));

      setBills(transformedBills);
    } catch (error) {
      console.error("Error fetching bills:", error);
      message.error("Không thể tải danh sách hóa đơn!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch apartments for dropdown
  const fetchApartments = useCallback(async () => {
    try {
      const response = await apartmentService.getAllApartments();
      setApartments(response.results || []);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchBills();
    fetchApartments();
  }, [fetchBills, fetchApartments]);

  // Map API status to UI status
  const mapApiStatusToUiStatus = (apiStatus) => {
    switch (apiStatus) {
      case "Paid":
        return "paid";
      case "Unpaid":
        return "unpaid";
      case "Overdue":
        return "overdue";
      default:
        return "unpaid";
    }
  };

  // Map UI status to API status
  const mapUiStatusToApiStatus = (uiStatus) => {
    switch (uiStatus) {
      case "paid":
        return "Paid";
      case "unpaid":
        return "Unpaid";
      case "overdue":
        return "Overdue";
      case "partial":
        return "Unpaid"; // Treat partial as unpaid in API
      default:
        return "Unpaid";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "green";
      case "unpaid":
        return "orange";
      case "overdue":
        return "red";
      case "partial":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "unpaid":
        return "Chưa thanh toán";
      case "overdue":
        return "Quá hạn";
      case "partial":
        return "Thanh toán một phần";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircleOutlined />;
      case "unpaid":
        return <ClockCircleOutlined />;
      case "overdue":
        return <ExclamationCircleOutlined />;
      case "partial":
        return <ClockCircleOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const columns = [
    {
      title: "Hóa đơn",
      key: "billInfo",
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: "16px" }}>
            {record.billNumber}
          </Text>
          <br />
          <Text type="secondary">{dayjs(record.month).format("MM/YYYY")}</Text>
        </div>
      ),
    },
    {
      title: "Căn hộ",
      key: "apartmentInfo",
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
      title: "Ngày phát hành",
      dataIndex: "issueDate",
      key: "issueDate",
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hạn thanh toán",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date, record) => {
        const isOverdue =
          dayjs().isAfter(dayjs(date)) && record.status !== "paid";
        return (
          <Text style={{ color: isOverdue ? "#f5222d" : "inherit" }}>
            {dayjs(date).format("DD/MM/YYYY")}
          </Text>
        );
      },
    },
    {
      title: "Số tiền",
      key: "amount",
      align: "right",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (_, record) => (
        <div>
          <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
            {record.totalAmount.toLocaleString()}
          </Text>
          <br />
          {record.status === "partial" && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Đã trả: {record.paidAmount.toLocaleString()}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Đã thanh toán", value: "paid" },
        { text: "Chưa thanh toán", value: "unpaid" },
        { text: "Quá hạn", value: "overdue" },
        { text: "Thanh toán một phần", value: "partial" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
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

  const handleAddBillWithDetails = () => {
    setDetailModalVisible(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    form.setFieldsValue({
      apartmentId: bill.apartmentId,
      dueDate: bill.dueDate ? dayjs(bill.dueDate) : null,
      status: mapApiStatusToUiStatus(bill.status),
      rentFee: bill.rentFee,
      serviceFee: bill.serviceFee,
    });
    setModalVisible(true);
  };

  const handleViewBill = async (bill) => {
    try {
      setLoading(true);
      // Get detailed invoice data including invoice details
      const detailedInvoice = await invoiceService.getInvoiceById(
        parseInt(bill.id.replace("HD", ""))
      );

      // Get invoice details
      const invoiceDetails =
        await invoiceDetailService.getInvoiceDetailsByInvoiceId(
          detailedInvoice.invoiceId
        );

      // Transform for viewing
      const transformedBill = {
        ...bill,
        services:
          invoiceDetails.results?.map((detail) => ({
            name: detail.serviceType?.serviceName || "N/A",
            usage: detail.usage,
            price: parseFloat(detail.serviceType?.unitPrice || 0),
            total: parseFloat(detail.totalAmount),
            unit: detail.serviceType?.unit || "",
          })) || [],
      };

      setViewingBill(transformedBill);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error fetching bill details:", error);
      message.error("Không thể tải chi tiết hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintBill = (bill) => {
    message.info(`Đang in hóa đơn ${bill.billNumber}...`);
    // Logic in hóa đơn
  };

  const handleDeleteBill = async (id) => {
    try {
      const invoiceId = parseInt(id.replace("HD", ""));
      await invoiceService.deleteInvoice(invoiceId);
      setBills(bills.filter((b) => b.id !== id));
      message.success("Đã xóa hóa đơn thành công!");
    } catch (error) {
      console.error("Error deleting bill:", error);
      message.error("Có lỗi xảy ra khi xóa hóa đơn!");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingBill) {
        // Update existing invoice
        const invoiceId = parseInt(editingBill.id.replace("HD", ""));
        const updateData = {
          status: mapUiStatusToApiStatus(values.status),
        };

        await invoiceService.updateInvoice(invoiceId, updateData);
        message.success("Cập nhật hóa đơn thành công!");
      } else {
        // Create new invoice
        const newInvoiceData = {
          apartmentId: values.apartmentId,
          rentFee: values.rentFee || 0,
          serviceFee: values.serviceFee || 0,
          dueDate: values.dueDate
            ? values.dueDate.format("YYYY-MM-DD")
            : dayjs().add(30, "day").format("YYYY-MM-DD"),
          status: mapUiStatusToApiStatus(values.status || "unpaid"),
        };

        await invoiceService.createInvoice(newInvoiceData);
        message.success("Tạo hóa đơn mới thành công!");
      }

      setModalVisible(false);
      form.resetFields();
      fetchBills(); // Reload data
    } catch (error) {
      console.error("Error saving bill:", error);
      message.error("Có lỗi xảy ra khi lưu hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = bills.filter(
    (bill) =>
      bill.billNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      bill.apartment.toLowerCase().includes(searchText.toLowerCase()) ||
      bill.resident.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalBills = bills.length;
  const paidBills = bills.filter((b) => b.status === "paid").length;
  const unpaidBills = bills.filter((b) => b.status === "unpaid").length;
  const overdueBills = bills.filter((b) => b.status === "overdue").length;
  const totalRevenue = bills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.paidAmount, 0);
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Header với gradient */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1890ff, #36cfc9)",
              borderRadius: "12px",
              padding: "12px",
              marginRight: "16px",
            }}
          >
            <DollarOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                background: "linear-gradient(135deg, #1890ff, #722ed1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Quản Lý Hóa Đơn
            </Title>
            <Text type="secondary">
              Quản lý hóa đơn và thanh toán của cư dân
            </Text>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan với gradient cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Tổng Hóa Đơn
                </span>
              }
              value={totalBills}
              prefix={<FileTextOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                >
                  hóa đơn
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Đã Thanh Toán
                </span>
              }
              value={paidBills}
              prefix={<CheckCircleOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                >
                  hóa đơn
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Chưa Thanh Toán
                </span>
              }
              value={unpaidBills + overdueBills}
              prefix={<ClockCircleOutlined style={{ color: "white" }} />}
              valueStyle={{
                color: "white",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              suffix={
                <span
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}
                >
                  hóa đơn
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              border: "none",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(100,100,100,0.8)" }}>
                  Doanh Thu
                </span>
              }
              value={totalRevenue}
              prefix={<span style={{ color: "#666" }}>₫</span>}
              valueStyle={{
                color: "#666",
                fontSize: "28px",
                fontWeight: "bold",
              }}
              formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              suffix={
                <span
                  style={{ color: "rgba(100,100,100,0.8)", fontSize: "16px" }}
                >
                  VNĐ
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng quản lý hóa đơn */}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                borderRadius: "8px",
                padding: "8px",
                marginRight: "12px",
              }}
            >
              <FileTextOutlined style={{ color: "white", fontSize: "16px" }} />
            </div>
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}
            >
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
              size="large"
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ minWidth: "300px" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBill}
              size="large"
              style={{
                background: "linear-gradient(135deg, #1890ff, #36cfc9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
              }}
            >
              Tạo Hóa Đơn Đơn Giản
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBillWithDetails}
              size="large"
              style={{
                background: "linear-gradient(135deg, #52c41a, #73d13d)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
              }}
            >
              Tạo Hóa Đơn Chi Tiết
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
        title={editingBill ? "✏️ Sửa Hóa Đơn" : "➕ Tạo Hóa Đơn Mới"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={700}
        confirmLoading={loading}
        okText={editingBill ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: "unpaid",
            dueDate: dayjs().add(30, "day"),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="apartmentId"
                label="Căn hộ"
                rules={[{ required: true, message: "Vui lòng chọn căn hộ!" }]}
              >
                <Select
                  placeholder="Chọn căn hộ"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {apartments.map((apt) => (
                    <Option key={apt.apartmentId} value={apt.apartmentId}>
                      {apt.apartmentType?.typeName || "N/A"} - Tầng {apt.floor}
                      (ID: {apt.apartmentId})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Hạn thanh toán"
                rules={[
                  { required: true, message: "Vui lòng chọn hạn thanh toán!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn hạn thanh toán"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="rentFee"
                label="Phí thuê căn hộ (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập phí thuê!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập phí thuê căn hộ"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="serviceFee"
                label="Phí dịch vụ (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập phí dịch vụ!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="Nhập phí dịch vụ"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="unpaid">Chưa thanh toán</Option>
                  <Option value="paid">Đã thanh toán</Option>
                  <Option value="overdue">Quá hạn</Option>
                </Select>
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
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <Title level={3}>{viewingBill.billNumber}</Title>
              <Tag
                color={getStatusColor(viewingBill.status)}
                style={{ fontSize: "14px" }}
              >
                {getStatusText(viewingBill.status)}
              </Tag>
            </div>

            <Descriptions bordered column={2} style={{ marginBottom: "24px" }}>
              <Descriptions.Item label="Căn hộ">
                {viewingBill.apartment}
              </Descriptions.Item>
              <Descriptions.Item label="Cư dân">
                {viewingBill.resident}
              </Descriptions.Item>
              <Descriptions.Item label="Tháng">
                {dayjs(viewingBill.month).format("MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày phát hành">
                {dayjs(viewingBill.issueDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Hạn thanh toán">
                {dayjs(viewingBill.dueDate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Phí thuê căn hộ">
                {viewingBill.rentFee?.toLocaleString() || 0} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Phí dịch vụ">
                {viewingBill.serviceFee?.toLocaleString() || 0} VNĐ
              </Descriptions.Item>
            </Descriptions>

            {viewingBill.services && viewingBill.services.length > 0 && (
              <>
                <Title level={4}>Chi tiết dịch vụ:</Title>
                <Table
                  size="small"
                  dataSource={viewingBill.services}
                  pagination={false}
                  columns={[
                    {
                      title: "Dịch vụ",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Sử dụng",
                      dataIndex: "usage",
                      key: "usage",
                      align: "center",
                      render: (usage, record) =>
                        `${usage} ${record.unit || ""}`,
                    },
                    {
                      title: "Đơn giá",
                      dataIndex: "price",
                      key: "price",
                      align: "right",
                      render: (price) => `${price.toLocaleString()} VNĐ`,
                    },
                    {
                      title: "Thành tiền",
                      dataIndex: "total",
                      key: "total",
                      align: "right",
                      render: (total) => (
                        <Text strong style={{ color: "#52c41a" }}>
                          {total.toLocaleString()} VNĐ
                        </Text>
                      ),
                    },
                  ]}
                />
              </>
            )}

            <Divider />

            <Row justify="end">
              <Col>
                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <Text>
                      Phí thuê căn hộ:
                      <strong>
                        {(viewingBill.rentFee || 0).toLocaleString()} VNĐ
                      </strong>
                    </Text>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <Text>
                      Phí dịch vụ:
                      <strong>
                        {(viewingBill.serviceFee || 0).toLocaleString()} VNĐ
                      </strong>
                    </Text>
                  </div>
                  <Divider style={{ margin: "8px 0" }} />
                  <Title level={4} style={{ marginBottom: "8px" }}>
                    Tổng cộng:
                    <Text style={{ color: "#52c41a" }}>
                      {viewingBill.totalAmount.toLocaleString()} VNĐ
                    </Text>
                  </Title>
                  {viewingBill.status === "paid" && (
                    <Text style={{ color: "#52c41a" }}>
                      ✓ Đã thanh toán đầy đủ
                    </Text>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Modal tạo hóa đơn chi tiết */}
      <CreateInvoiceWithDetailsModal
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        onSuccess={() => {
          fetchBills(); // Reload bills list
        }}
      />
    </div>
  );
};

export default BillManagement;
