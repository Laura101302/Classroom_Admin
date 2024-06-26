export interface Room {
  id: number;
  name: string;
  seats_number: number;
  floor_number: number;
  reservation_type: number;
  state: number;
  allowed_roles_ids: string;
  room_type_id: number;
  center_cif: string;
}
