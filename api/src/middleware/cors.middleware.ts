import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { corsConfig } from '../config/cors.config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    const nodeEnv = this.configService.get('NODE_ENV') || 'development';
    
    // Get allowed origins based on environment
    const allowedOrigins = this.getAllowedOrigins(nodeEnv);
    
    // Check if origin is allowed
    if (origin && this.isOriginAllowed(origin, allowedOrigins)) {
      res.header('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.includes('*')) {
      res.header('Access-Control-Allow-Origin', '*');
    }
    
    // Set other CORS headers
    res.header('Access-Control-Allow-Methods', corsConfig.methods.join(', '));
    res.header('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
    res.header('Access-Control-Allow-Credentials', corsConfig.credentials.toString());
    res.header('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(', '));
    res.header('Access-Control-Max-Age', corsConfig.maxAge.toString());
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(corsConfig.optionsSuccessStatus).end();
      return;
    }
    
    next();
  }

  private getAllowedOrigins(environment: string): string[] {
    let origins: string[] = [];
    
    // Get base origins from config
    switch (environment) {
      case 'production':
        origins = [...corsConfig.production];
        break;
      case 'test':
        origins = [...corsConfig.test];
        break;
      default:
        origins = [...corsConfig.development];
        // Add wildcard for development
        origins.push('*');
    }

    // Add custom origins from environment variable
    const customOrigins = this.configService.get('CORS_ORIGINS');
    if (customOrigins) {
      const additionalOrigins = customOrigins.split(',').map(origin => origin.trim());
      origins.push(...additionalOrigins);
    }

    return origins;
  }

  private isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === '*') return true;
      if (allowedOrigin === origin) return true;
      
      // Handle wildcard patterns like http://192.168.1.*
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(origin);
      }
      
      return false;
    });
  }
}
