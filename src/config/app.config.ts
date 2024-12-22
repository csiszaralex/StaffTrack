import { AppConfig } from './app.config.interface';

export default (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000'),
  DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/test',
  node_env: process.env.NODE_ENV || 'development',

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    auth_url: process.env.FRONTEND_AUTH_URL || 'http://localhost:3000/auth',
  },

  auth: {
    jwt: {
      accessToken: {
        secret: process.env.JWT_ACCESSTOKEN_SECRET || 'secret',
        expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRES_IN || '1h',
      },
      refreshToken: {
        secret: process.env.JWT_REFRESHTOKEN_SECRET || 'anotherSECRET',
        expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRES_IN || '1w',
      },
    },
  },
});
