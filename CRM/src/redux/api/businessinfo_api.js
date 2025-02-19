import { getService } from "../commonServices";

export class BusinessInfoService {
  async getBusinessInfo(id) {
    let url = `/admin/businessinfo/${id}`;
    // let data = getService(url);
    const data = await getService(url);
    console.log("API Response:", data);
    return data;
  }
}