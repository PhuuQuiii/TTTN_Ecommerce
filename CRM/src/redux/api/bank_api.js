import { postService, getService } from "../commonServices";

export class BankService {
  updateBank(bank, id) {
    const body = JSON.stringify(bank);
    let url = `/admin/bank/${id}`;
    let data = postService(url, body, 'PUT');
    return data;
  }

  getBankInfo(id) {
    let url = `/admin/bank/${id}`;
    let data = getService(url);
    return data;
  }
}