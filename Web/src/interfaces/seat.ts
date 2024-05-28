export interface Seat {
  id: number;
  name: string;
  state: number;
  room_id: number;
  room_name?: string;
  center_cif?: string;
}
