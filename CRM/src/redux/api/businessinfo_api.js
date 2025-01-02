import { getService } from "../commonServices";

export class BusinessInfoService {
  getBusinessInfo(id) {
    let url = `/admin/businessinfo/${id}`;
    let data = getService(url);
    return data;
  }
}