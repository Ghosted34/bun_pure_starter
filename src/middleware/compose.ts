type Handler = (req: Request) => Promise<Response> | Response;

export function compose(...handlers: Handler[]): Handler {
  return async (req: Request) => {
    let index = -1;

    async function dispatch(i: number): Promise<Response> {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;

      const fn = handlers[i];
      if (!fn) throw new Error("No handler returned a response");

      return fn(req);
    }

    return dispatch(0);
  };
}
