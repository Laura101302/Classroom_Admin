import { Center } from './center';

export interface Reserve {
  id: number;
  room_id: number;
  room_name?: string;
  seat_id?: number;
  teacher_email: string;
  center?: Center;
  reservation_type?: number;
}
