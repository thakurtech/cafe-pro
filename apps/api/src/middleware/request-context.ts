import type { NextFunction, Request, Response } from 'express';

export interface RequestContext {
  requestId: string;
}

declare global {
  namespace Express {
    interface Request { context?: RequestContext }
  }
}

export function requestContext(req: Request, _res: Response, next: NextFunction) {
  req.context = { requestId: crypto.randomUUID() };
  next();
}
