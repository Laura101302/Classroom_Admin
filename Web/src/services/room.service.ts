import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';
import { Room } from 'src/interfaces/room';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/room.php';

  constructor(private http: HttpClient) {}

  getAllRooms() {
    return this.http.get<IResponse>(this.url);
  }

  getRoomById(id: number) {
    return this.http.get<IResponse>(this.url + `?id=${id}`);
  }

  createRoom(body: Room) {
    return this.http.post<IResponse>(this.url, body);
  }

  editRoom(body: Room) {
    return this.http.put<IResponse>(this.url, body);
  }

  deleteRoom(id: number) {
    return this.http.delete<IResponse>(this.url + '/' + id);
  }
}
