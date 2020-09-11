import { IConfig } from './utils/general-types';

const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    ui: 'http://localhost:3000',
    secret:
      '36ab856a643a48b90f4a57d73866aba3777966adbb072ecea7b557630f7ca1e1ef6c77a496366874b7e1b2a031530d37145525cc2e9630310bd4a96079450529',
    email: {
      host: 'localhost',
      port: 1025,
      secure: false
    },
    db: {
      username: 'postgres',
      password: null,
      database: 'cards_development',
      host: '127.0.0.1',
      dialect: 'postgres'
    }
  },
  test: {
    ui: 'http://localhost:3000',
    secret:
      'c4327af3eef51c5382aad9fa6b6322225385aaf8000139b36db942740256625f0c19b09579596f6feb4f2861b5a8457dcd1c8c3c76d534543f1d192f787fab3c',
    email: {
      host: 'localhost',
      port: 1025,
      secure: false
    },
    db: {
      username: 'postgres',
      password: null,
      database: 'cards_testing',
      host: '127.0.0.1',
      dialect: 'postgres'
    }
  },
  production: {
    ui: 'https://play-deuces.herokuapp.com/',
    secret: process.env.SECRET_KEY_BASE!,
    email: {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: process.env['SENDGRID_USERNAME'],
        pass: process.env['SENDGRID_PASSWORD']
      },
      name: 'play-deuces.herokuapp.com'
    },
    db: {
      useEnvVariable: 'DATABASE_URL',
      dialect: 'postgres'
    }
  }
};

export default config[
  (env as unknown) as 'development' | 'production' | 'test'
] as IConfig;
