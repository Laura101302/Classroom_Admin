import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/room.php';

  constructor(private http: HttpClient) {}

  getAllRooms() {
    return this.http.get<any>(this.url);
  }

  getRoomById(id: string) {
    return this.http.get<any>(this.url + `?id=${id}`);
  }

  createRoom(body: any) {
    return this.http.post<any>(this.url, body);
  }

  editRoom(body: any) {
    return this.http.put<any>(this.url, body);
  }

  deleteRoom(id: number) {
    return this.http.delete<any>(this.url + '/' + id);
  }
}
