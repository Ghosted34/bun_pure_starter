export interface Database {
  users: {
    id: number;
    email: string;
    password_hash: string;
  };
}
