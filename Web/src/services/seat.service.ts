import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';
import { Seat } from 'src/interfaces/seat';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/seat.php';

  constructor(private http: HttpClient) {}

  getAllSeats() {
    return this.http.get<IResponse>(this.url);
  }

  getAllSeatsByRoomId(room_id: number) {
    return this.http.get<IResponse>(this.url + `?room_id=${room_id}`);
  }

  getAvailableSeatsByRoomId(room_id: number, state: number = 1) {
    return this.http.get<IResponse>(
      this.url + `?room_id=${room_id}&state=${state}`
    );
  }

  getSeatById(id: number) {
    return this.http.get<IResponse>(this.url + `?id=${id}`);
  }

  createSeat(body: Seat) {
    return this.http.post<IResponse>(this.url, body);
  }

  editSeat(body: Seat) {
    return this.http.put<IResponse>(this.url, body);
  }

  deleteSeat(id: number) {
    return this.http.delete<IResponse>(this.url + '/' + id);
  }

  updateState(id: number, state: number) {
    return this.http.put<IResponse>(
      this.url + `?id=${id}&state=${state}`,
      null
    );
  }

  updateSeatStateByRoomId(room_id: number, state: number) {
    return this.http.put<IResponse>(
      this.url + `?room_id=${room_id}&state=${state}`,
      null
    );
  }
}
