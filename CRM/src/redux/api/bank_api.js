import { postService, getService } from "../commonServices";

export class BankService {
  updateBank(bank, id) {
    const body = JSON.stringify(bank);
    let url = `/admin/bank/${id}`;
    let data = postService(url, body, 'PUT');
    return data;
  }

  async getBankInfo(id) {
    let url = `/admin/bank/${id}`;
    const data = await getService(url);
    return data;
}

}