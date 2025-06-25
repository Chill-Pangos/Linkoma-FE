import axiosInstance from "./axiosConfig";

export const invoiceDetailService = {
  // Get all invoice details with filters
  getAllInvoiceDetails: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/invoice-details", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      throw error;
    }
  },

  // Get invoice detail by ID
  getInvoiceDetailById: async (detailId) => {
    try {
      const response = await axiosInstance.get(`/invoice-details/${detailId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice detail:", error);
      throw error;
    }
  },

  // Get invoice details by invoice ID
  getInvoiceDetailsByInvoiceId: async (invoiceId) => {
    try {
      const response = await axiosInstance.get("/invoice-details", {
        params: { invoiceId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching invoice details by invoice ID:", error);
      throw error;
    }
  },

  // Create invoice detail
  createInvoiceDetail: async (detailData) => {
    try {
      const response = await axiosInstance.post("/invoice-details", detailData);
      return response.data;
    } catch (error) {
      console.error("Error creating invoice detail:", error);
      throw error;
    }
  },

  // Update invoice detail
  updateInvoiceDetail: async (detailId, updateData) => {
    try {
      const response = await axiosInstance.patch(
        `/invoice-details/${detailId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating invoice detail:", error);
      throw error;
    }
  },

  // Delete invoice detail
  deleteInvoiceDetail: async (detailId) => {
    try {
      const response = await axiosInstance.delete(
        `/invoice-details/${detailId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting invoice detail:", error);
      throw error;
    }
  },

  // Bulk create invoice details
  createMultipleInvoiceDetails: async (detailsArray) => {
    try {
      const promises = detailsArray.map((detail) =>
        axiosInstance.post("/invoice-details", detail)
      );
      const responses = await Promise.all(promises);
      return responses.map((response) => response.data);
    } catch (error) {
      console.error("Error creating multiple invoice details:", error);
      throw error;
    }
  },
};
