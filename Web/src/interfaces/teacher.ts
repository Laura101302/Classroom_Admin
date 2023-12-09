export interface Teacher {
  dni: string;
  pass: string;
  name: string;
  surnames: string;
  phone: string;
  email: string;
  birthdate: Date;
  id_role: number;
}

export interface TeacherResponse {
  code: number;
  status: string;
  message: string;
  response: string;
}
