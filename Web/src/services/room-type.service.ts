import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';
import { RoomType } from 'src/interfaces/room-type';

@Injectable({
  providedIn: 'root',
})
export class RoomTypeService {
  url: string =
    'http://localhost/Classroom_Admin/API/controllers/room-type.php';

  constructor(private http: HttpClient) {}

  getAllRoomTypes() {
    return this.http.get<IResponse>(this.url);
  }

  getRoomTypeById(id: number) {
    return this.http.get<IResponse>(this.url + `?id=${id}`);
  }

  createRoomType(body: RoomType) {
    return this.http.post<IResponse>(this.url, body);
  }

  editRoomType(body: RoomType) {
    return this.http.put<IResponse>(this.url, body);
  }

  deleteRoomType(id: number) {
    return this.http.delete<IResponse>(this.url + '/' + id);
  }
}
