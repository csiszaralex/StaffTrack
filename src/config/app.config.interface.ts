export interface AppConfig {
  port: number;
  DATABASE_URL: string;
  auth: {
    jwt: {
      accessToken: {
        secret: string;
        expiresIn: string;
      };
      refreshToken: {
        secret: string;
        expiresIn: string;
      };
    };
  };
  frontend: {
    url: string;
    auth_url: string;
  };
  'auth.jwt.accessToken.secret'?: string;
  'auth.jwt.accessToken.expiresIn'?: string;
  'auth.jwt.refreshToken.secret'?: string;
  'auth.jwt.refreshToken.expiresIn'?: string;
  'frontend.url'?: string;
  'frontend.auth_url'?: string;
  node_env: string;
}
