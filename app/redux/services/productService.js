import { SERVER_BASE_URL } from "../../utils/common";
import { getService, getTokenService, postTokenService } from "../../utils/commonService";

export class ProductService {
  async getLatestProducts() {
    let url = `${SERVER_BASE_URL}/api/product/mined-products?page=1&perPage=12&keyword=trending`
    console.log('Fetching latest products from:', url);
    let data = await getService(url, 'GET');
    console.log('API response:', data);
    return data;
  }

  productCategories() {
    let url = `${SERVER_BASE_URL}/api/superadmin/product-categories`
    let data = getService(url, 'GET');
    return data;
  }

  getProductDetails(slug, token) {
    let url = `${SERVER_BASE_URL}/api/product/${slug}`
    let data = token ? getTokenService(url, 'GET', token) : getService(url, 'GET');
    return data;
  }

  async getQandA(query) {
    let url = `${SERVER_BASE_URL}/api/review-qna/qna/${query}`
    let data = getService(url, 'GET');
    return data;
  }

  async postQuestion(query, body) {
    let url = `${SERVER_BASE_URL}/api/review-qna/qna/${query}`
    let data = postTokenService(url, 'POST', body);
    return data;
  }

  async getProductReviews(query) {
    let url = `${SERVER_BASE_URL}/api/review-qna/review/${query}`
    let data = getService(url, 'GET');
    return data;
  }

  async postReviews(query, body) {
    let url = `${SERVER_BASE_URL}/api/review-qna/review/${query}`
    let data = postTokenService(url, 'POST', body);
    return data;
  }
}
