export interface IConfig {
  ui: string;
  secret: string;
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    name?: string;
  };
  db: {
    username?: string;
    password?: string | null;
    database?: string;
    host?: string;
    dialect?: 'postgres';
    useEnvVariable?: string;
  };
}
