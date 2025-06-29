# 🏢 Linkoma - Hệ Thống Quản Lý Chung Cư (Web Admin)

Linkoma là một hệ thống quản lý chung cư hiện đại được chia thành 2 phần:

- **🖥️ Web Admin (dự án này)**: Dành cho quản trị viên, quản lý, nhân viên
- **📱 Mobile App**: Dành cho cư dân (phát triển riêng)

Phần Web Admin cung cấp giao diện quản lý toàn diện cho việc điều hành tòa nhà, quản lý cư dân, hóa đơn và các dịch vụ chung cư.

## ✨ Tính Năng Chính (Web Admin)

### 🔐 Hệ Thống Phân Quyền (Web)

- **Admin**: Toàn quyền quản lý hệ thống và cấu hình ✅ **Đã hoàn thành**
- **Manager**: Quản lý các hoạt động hàng ngày của tòa nhà ✅ **Đã hoàn thành**
- **Resident**: Sử dụng Mobile App riêng~~ 📱 **Mobile App riêng**

### 👥 Quản Lý Người Dùng (Admin Panel)

- ✅ CRUD tài khoản người dùng (hiện tại: Admin, Manager)
- ⚡ Tạo nhanh tài khoản cư dân chỉ với email
- 📊 Thống kê người dùng theo vai trò và trạng thái
- 🔍 Tìm kiếm và lọc nâng cao
- 👁️ Xem chi tiết thông tin cá nhân
- 🔑 Quản lý phân quyền cơ bản (Admin/Manager)

### 🏠 Quản Lý Căn Hộ (Admin) 🚧

- 🏢 Quản lý thông tin căn hộ và tầng lầu **[Đang phát triển]**
- 👨‍👩‍👧‍👦 Gán/chuyển đổi cư dân vào căn hộ **[Đang phát triển]**
- 📋 Theo dõi trạng thái căn hộ (trống, đã thuê, bảo trì) **[Đang phát triển]**
- 🔧 Quản lý thiết bị và tài sản căn hộ **[Kế hoạch tương lai]**

### 💰 Quản Lý Hóa Đơn (Admin) ✅

- 📄 Tạo và quản lý hóa đơn cho tất cả căn hộ **[Đã hoàn thành]**
- 🔍 Tìm kiếm hóa đơn theo nhiều tiêu chí **[Đã hoàn thành]**
- 💳 Theo dõi trạng thái thanh toán (pending, paid, overdue) **[Đã hoàn thành]**
- 📊 Báo cáo thu chi chi tiết theo tháng/quý/năm **[Đã hoàn thành]**
- 💸 Quản lý phí phạt và ưu đãi **[Đang phát triển]**

### 🔧 Quản Lý Bảo Trì (Admin/Manager) 🚧

- 🛠️ Tiếp nhận yêu cầu bảo trì **[Đang phát triển]**
- 📋 Theo dõi tiến độ xử lý và lịch sử bảo trì **[Đang phát triển]**
- 👷 Phân công nhân viên **[Kế hoạch tương lai]**
- 📈 Thống kê chi phí và hiệu suất bảo trì **[Kế hoạch tương lai]**

### 📢 Thông Báo & Sự Kiện (Admin/Manager) 🚧

- 📣 Gửi thông báo tới cư dân **[Đã hoàn thành]**
- 🎉 Quản lý sự kiện chung cư **[Đã hoàn thành]**
- 📋 Theo dõi tỷ lệ đọc và phản hồi **[Đã hoàn thành]**
- 📱 Push notification đến Mobile App **[Kế hoạch tương lai]**

### 📊 Dashboard & Báo Cáo (Admin/Manager) ✅

- 📈 Dashboard tổng quan cho Admin và Manager **[Đã hoàn thành]**
- 📊 Biểu đồ thống kê cơ bản (doanh thu, người dùng) **[Đã hoàn thành]**
- 📋 Báo cáo cơ bản theo thời gian **[Đã hoàn thành]**
- 💹 Phân tích doanh thu cơ bản **[Đã hoàn thành]**
- 🎯 KPI cơ bản **[Đang phát triển]**

## 🚧 Trạng Thái Phát Triển Hiện Tại

### ✅ **Đã Hoàn Thành (v1.0)**

- 🔐 Authentication system (Admin/Manager login)
- 👥 User Management (CRUD, roles, quick create)
- 💰 Bill Management (invoices, payment tracking)
- 📊 Dashboard (basic charts, statistics)
- 📋 Reports (financial reports, user stats)
- 🏠 Apartment Management (basic structure)
- 🔧 Maintenance Management (general management)
- 📢 Notifications & Events (general management)

### 📋 **Kế Hoạch Tương Lai**

- 👷 Staff & Security roles
- 📱 Mobile App integration
- 🔄 Advanced automation
- 📊 Enhanced analytics

## 🛠️ Công Nghệ Sử Dụng

### Frontend (Web Admin)

- **React 19** - Library UI hiện đại cho admin panel
- **Vite** - Build tool nhanh chóng và hiệu quả
- **Ant Design 5** - Component library chuyên nghiệp cho admin
- **React Router v7** - Routing mạnh mẽ cho SPA
- **Axios** - HTTP client để giao tiếp với Backend API
- **Chart.js** - Biểu đồ và analytics cho dashboard
- **Day.js** - Xử lý thời gian và ngày tháng
- **Zustand** - State management nhẹ nhàng

### Styling & UI (Desktop-First)

- **Ant Design Icons** - Bộ icon professional cho admin
- **CSS3 với Gradient** - Giao diện hiện đại và đẹp mắt
- **Desktop Responsive** - Tối ưu cho màn hình lớn (laptop/desktop)
- **Admin Theme** - Color scheme chuyên nghiệp cho quản lý

## 🚀 Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống

- Node.js >= 18.0.0
- Yarn >= 1.22.0 (khuyến nghị) hoặc npm

### Cài Đặt Yarn (nếu chưa có)

```bash
# Cài đặt Yarn globally
npm install -g yarn

# Kiểm tra version
yarn --version
```

### Cài Đặt Dự Án

```bash
# Clone dự án
git clone [repository-url]
cd linkoma-fe

# Cài đặt dependencies với Yarn (khuyến nghị)
yarn install

# Hoặc sử dụng npm
npm install
```

### Chạy Dự Án với Vite

```bash
# Development server với hot reload (Vite)
yarn dev
# Hoặc: npm run dev

# Build cho production
yarn build
# Hoặc: npm run build

# Preview production build
yarn preview
# Hoặc: npm run preview

# Lint và kiểm tra code
yarn lint
# Hoặc: npm run lint
```

### 🔥 Tính Năng Vite

- **⚡ Hot Module Replacement (HMR)**: Cập nhật realtime khi dev
- **🚀 Fast Cold Start**: Khởi động nhanh hơn Webpack
- **📦 Optimized Build**: Build production tối ưu với Rollup
- **🔌 Rich Plugin Ecosystem**: Hỗ trợ nhiều plugin mở rộng

### Cấu Hình Môi Trường

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Linkoma
```

## 📁 Cấu Trúc Dự Án

```
src/
├── components/          # Shared components
├── hooks/              # Custom React hooks
│   └── useAuth.js     # Authentication hook
├── layouts/           # Layout components
│   ├── AdminLayout.jsx
│   └── SidebarMenu.jsx
├── pages/             # Page components
│   ├── Admin/         # Admin management pages
│   │   ├── Dashboard/           # ✅ Admin dashboard & analytics
│   │   ├── UserManagement/      # ✅ Manage users (Admin, Manager, basic Resident)
│   │   ├── BillManagement/      # ✅ Invoice & billing management
│   │   ├── Reports/             # ✅ Basic reports & analytics
│   │   ├── ApartmentManagement/ # 🚧 Apartment management [In development]
│   │   ├── MaintenanceManagement/ # 🚧 Maintenance [In development]
│   │   ├── ServiceManagement/   # 🚧 Services [In development]
│   │   ├── EventNotificationManagement/ # 🚧 Events [In development]
│   │   └── FeedbackManagement/  # 🚧 Feedback [In development]
│   ├── Auth/          # ✅ Authentication pages (admin login)
│   ├── Manager/       # ✅ Manager-specific pages (basic)
│   ├── Public/        # 🚧 Public pages [In development]
│   └── ~~Resident/~~  # ❌ Moved to Mobile App
├── router/            # Routing configuration
├── services/          # API services
│   ├── adminService.js
│   ├── userService.js
│   ├── invoiceService.js
│   └── invoiceDetailService.js
├── store/             # Global state management
├── utils/             # Utility functions
└── assets/            # Static assets
```

## 🎨 Tính Năng UI/UX (Web Admin)

### 🖥️ Desktop-First Design

- � Tối ưu cho màn hình lớn (laptop/desktop 1200px+)
- 📊 Layout phức tạp với nhiều panel và table
- 🎛️ Dashboard với nhiều widget và biểu đồ
- � Data table với pagination và filtering mạnh mẽ

### 🌈 Professional Admin Theme

- 🎨 Color scheme chuyên nghiệp (blue gradient)
- 🔄 Smooth transitions và animations tinh tế
- �️ Hover effects và interactive elements
- 🌙 Consistent design language cho admin panel

### ⚡ Performance (Desktop)

- 🚀 Fast loading với Vite HMR
- 📦 Code splitting tự động cho từng module
- 🔄 Lazy loading cho heavy components (charts, tables)
- 💾 Optimized builds với Rollup
- ⚡ Lightning fast dev server cho development

## 📊 Tính Năng Nổi Bật (Phiên Bản Hiện Tại)

### 🎛️ Admin Dashboard Thông Minh

- 📈 Biểu đồ realtime (doanh thu, cư dân, bảo trì)
- 🎯 KPI tracking và performance metrics
- 📊 Visual analytics với Chart.js
- 🔔 Alert system cho các vấn đề cần xử lý
- 📋 Quick actions và shortcuts

### 👥 Quản Lý Người Dùng Toàn Diện

- ⚡ Quick create tài khoản cư dân chỉ với email
- 🔍 Advanced search & filter (role, status, apartment)
- 👥 Bulk operations (import/export, mass update)
- 📊 User statistics và engagement metrics
- 🔑 Role-based access control

### 💰 Hệ Thống Billing Hoàn Chỉnh

- 📄 Invoice generator với detailed breakdown
- � Payment status tracking và reminders
- 📊 Financial reports và revenue analytics
- 🔄 Auto calculations cho phí chung cư
- 📱 Integration với Mobile payment notifications

### 🏢 Ecosystem Integration

- 📱 **Mobile App Connection**: Nhận data từ Resident mobile app
- 🔄 **Realtime Sync**: Push notifications đến mobile
- 📊 **Cross-platform Analytics**: Thống kê toàn bộ hệ thống
- 🔗 **API Gateway**: Centralized data management

## 🔧 Scripts Có Sẵn

### Yarn Commands (Khuyến nghị)

- `yarn dev` - Khởi động Vite development server với HMR
- `yarn build` - Build cho production với Vite + Rollup
- `yarn preview` - Preview production build locally
- `yarn lint` - Kiểm tra lỗi code với ESLint

### NPM Commands (Thay thế)

- `npm run dev` - Khởi động development server
- `npm run build` - Build cho production
- `npm run preview` - Preview production build
- `npm run lint` - Kiểm tra lỗi code

### 🎯 Development Tips

```bash
# Chạy nhanh với Vite trực tiếp
yarn vite

# Chạy dev server trên port tùy chỉnh
yarn dev --port 3000

# Build với mode development để debug
yarn build --mode development

# Analyze bundle size
yarn build --analyze
```

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <strong>🏢 Linkoma Web Admin - Giải Pháp Quản Lý Chung Cư Chuyên Nghiệp 🏢</strong>
  <br/>
  <em>🖥️ Web Admin Dashboard | 📱 Mobile App cho Resident (riêng biệt)</em>
</div>
