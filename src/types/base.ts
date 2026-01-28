export interface Ctx {
  traceId: string;
  token?:string
  user?: {
    id: string;
    role: string;
  };
  startTime: number;
}


export type Handler = (req: Request, ctx: Ctx) => Promise<Response>;
export type Middleware = (next: Handler) => Handler;

