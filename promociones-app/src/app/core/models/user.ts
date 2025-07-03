export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  name?: {
    first: string;
    last: string;
  };
  gender?: string;
  location?: any;
  email?: string;
  phone?: string;
  cell?: string;
  picture?: {
    large: string;
  };
}
