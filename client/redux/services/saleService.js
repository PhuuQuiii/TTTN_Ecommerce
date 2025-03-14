import {
  getService,
  getTokenService,
  postTokenService,
  deleteTokenService
} from "../../utils/commonService";
import { SALE_BASE_URL } from "../../utils/constants";

class SaleService {
  // Gọi GET /active để lấy danh sách sale đang diễn ra
  async getActiveSales() {
    const url = `${SALE_BASE_URL}/active`;
    // getService là hàm GET request không gửi token
    const response = await getService(url);
    return response?.data;
  }

  // Gọi GET /all để lấy tất cả chương trình sale
  async getAllSales() {
    const url = `${SALE_BASE_URL}/all`;
    const response = await getService(url);
    return response?.data;
  }
}

export default new SaleService();
