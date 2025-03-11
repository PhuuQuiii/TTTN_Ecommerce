import { postService, getService } from "../commonServices";

export class SaleService {
  // POST /sale/create
  async createSale(saleData) {
    const body = JSON.stringify(saleData);
    const url = "/sale/create";
    return postService(url, body, "POST");
  }

  // GET /sale/active
  async getActiveSales() {
    const url = "/sale/active";
    return getService(url);
  }

  // GET /sale/admin/:adminId
  async getSalesByAdminId(adminId) {
    const url = `/sale/admin/${adminId}`;
    return getService(url);
  }

  // GET /sale/all
  async getAllSales() {
    const url = "/sale/all";
    return getService(url);
  }
}