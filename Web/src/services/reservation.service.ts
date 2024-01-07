import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  url: string =
    'http://localhost/Classroom_Admin/API/controllers/reservation.php';

  constructor(private http: HttpClient) {}

  getAllReserves() {
    return this.http.get<IResponse>(this.url);
  }

  getReserveById(id: number) {
    return this.http.get<IResponse>(this.url + `?id=${id}`);
  }

  createReserve(body: any) {
    return this.http.post<IResponse>(this.url, body);
  }

  editReserve(body: any) {
    return this.http.put<IResponse>(this.url, body);
  }

  deleteReserve(id: number) {
    return this.http.delete<IResponse>(this.url + '/' + id);
  }
}
