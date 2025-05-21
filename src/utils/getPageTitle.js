const getPageTitle = (key) => {
  switch (key) {
    case "dashboard":
      return "Tổng quan";
    case "users":
      return "Quản lý Tài khoản";
    case "apartment":
      return "Quản lý Căn hộ";
    case "invoice":
      return "Dịch vụ & Hóa đơn";
    case "feedback":
      return "Phản hồi cư dân";
    default:
      return "";
  }
};
export default getPageTitle;