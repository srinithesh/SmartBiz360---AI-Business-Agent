
import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwt: {
    accessSecret: process.env.JWT_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpiration: '15m',
    refreshExpiration: '7d',
  },
};

// Validate that all essential environment variables are set
if (!config.jwt.accessSecret || !config.jwt.refreshSecret) {
  throw new Error('FATAL ERROR: JWT secrets are not defined in the environment variables.');
}

if (!config.databaseUrl) {
    throw new Error('FATAL ERROR: DATABASE_URL is not defined in the environment variables.');
}

export default config;