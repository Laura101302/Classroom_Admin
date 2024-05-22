import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reserve } from 'src/interfaces/reserve';
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

  getAllReservesByTeacherEmail(email: string) {
    return this.http.get<IResponse>(this.url + `?email=${email}`);
  }

  getAllReservesDateBySeatId(seat_id: number) {
    return this.http.get<IResponse>(this.url + `?seat_id=${seat_id}`);
  }

  getAllReservesDateByRoomId(room_id: number) {
    return this.http.get<IResponse>(this.url + `?room_id=${room_id}`);
  }

  getReserveById(id: number) {
    return this.http.get<IResponse>(this.url + `?id=${id}`);
  }

  createReserve(body: Reserve) {
    return this.http.post<IResponse>(this.url, body);
  }

  editReserve(body: Reserve) {
    return this.http.put<IResponse>(this.url, body);
  }

  deleteReserve(id: number, updateState: boolean) {
    return this.http.delete<IResponse>(this.url + '/' + id + '/' + updateState);
  }
}
