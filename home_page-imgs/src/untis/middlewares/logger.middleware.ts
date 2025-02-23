import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { getLogger, Logger } from 'log4js';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger;
  constructor() {
    this.logger = getLogger();
    this.logger.level = 'debug';
  }

  use(req: Request, res: Response, next: Function) {
    this.logger.info(`[${req.method}] ${req.url} from ${req.hostname}`);
    next();
  }
}
