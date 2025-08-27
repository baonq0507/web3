import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  PORT: Joi.number().default(3000),
  
  MONGODB_URI: Joi.string().required(),
  
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  
  // TODO: Uncomment when Redis is available
  // REDIS_HOST: Joi.string().default('localhost'),
  // REDIS_PORT: Joi.number().default(6379),
  // REDIS_PASSWORD: Joi.string().optional(),
  
  BINANCE_API_KEY: Joi.string().optional(),
  BINANCE_SECRET_KEY: Joi.string().optional(),
  
  TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string().default('Crypto Trading Admin'),
  
  // CORS Configuration - Multiple origins support
  CORS_ORIGINS: Joi.string().optional(),
  
  RATE_LIMIT_TTL: Joi.number().default(60000),
  RATE_LIMIT_LIMIT: Joi.number().default(100),
});
