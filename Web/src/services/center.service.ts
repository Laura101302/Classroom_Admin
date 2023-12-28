import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class CenterService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/center.php';

  constructor(private http: HttpClient) {}

  getAllCenters() {
    return this.http.get<IResponse>(this.url);
  }

  getCenterByCif(cif: string) {
    return this.http.get<IResponse>(this.url + `?cif=${cif}`);
  }

  createCenter(body: Center) {
    return this.http.post<IResponse>(this.url, body);
  }

  editCenter(body: Center) {
    return this.http.put(this.url, body);
  }

  deleteCenter(cif: string) {
    return this.http.delete(this.url + '/' + cif);
  }
}
