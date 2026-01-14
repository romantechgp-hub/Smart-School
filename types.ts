
export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT'
}

export interface IdCardConfig {
  backgroundColor: string;
  fontFamily: string;
  textColor: string;
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  password: string;
  role: UserRole;
  phone?: string;
  email?: string;
  className?: string;
  roll?: string;
  photo?: string;
  joinDate: string;
  idCardConfig?: IdCardConfig;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  link?: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  text: string;
  size: 'small' | 'medium' | 'large';
  createdAt: string;
}

export interface SchoolLink {
  id: string;
  title: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}
