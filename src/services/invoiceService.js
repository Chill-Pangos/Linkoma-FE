import axiosInstance from "./axiosConfig";

export const invoiceService = {
  // Get all invoices with filters
  getAllInvoices: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/invoices", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  },

  // Get invoice by ID
  getInvoiceById: async (invoiceId) => {
    try {
      const response = await axiosInstance.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice:", error);
      throw error;
    }
  },

  // Create simple invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await axiosInstance.post("/invoices", invoiceData);
      return response.data;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  },

  // Create invoice with details (based on service usages)
  createInvoiceWithDetails: async (invoiceData) => {
    try {
      const response = await axiosInstance.post("/invoices/with-details", invoiceData);
      return response.data;
    } catch (error) {
      console.error("Error creating invoice with details:", error);
      throw error;
    }
  },

  // Update invoice
  updateInvoice: async (invoiceId, updateData) => {
    try {
      const response = await axiosInstance.patch(
        `/invoices/${invoiceId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  },

  // Delete invoice
  deleteInvoice: async (invoiceId) => {
    try {
      const response = await axiosInstance.delete(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
    }
  },

  // Update invoice status (common operation)
  updateInvoiceStatus: async (invoiceId, status) => {
    try {
      const response = await axiosInstance.patch(`/invoices/${invoiceId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating invoice status:", error);
      throw error;
    }
  },
};
