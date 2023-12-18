export interface Student {
  dni: string;
  pass: string;
  name: string;
  surnames: string;
  phone: string;
  email: string;
  birthdate: Date;
  code_course: string;
}

export interface StudentResponse {
  code: number;
  status: string;
  message: string;
  response: string;
}
