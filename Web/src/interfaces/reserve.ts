import { Center } from './center';

export interface Reserve {
  id: number;
  room_id: number;
  seat_id?: number;
  teacher_email: string;
  center?: Center;
}
