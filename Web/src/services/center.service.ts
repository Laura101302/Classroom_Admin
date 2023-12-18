import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CenterService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/center.php';

  constructor(private http: HttpClient) {}

  getAllCenters() {
    return this.http.get<any>(this.url);
  }

  getCenterByCif(cif: string) {
    return this.http.get<any>(this.url + '/' + cif);
  }

  createCenter(body: any) {
    return this.http.post<any>(this.url, body);
  }

  editCenter(body: any) {
    return this.http.put(this.url, body);
  }

  deleteCenter(cif: string) {
    return this.http.delete(this.url + '/' + cif);
  }
}
