import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // try to parse schema
      schema.parse({
          body: req.body,
          query: req.query,
          params: req.params
      })
      
      next()
    } catch (e:any) {
      // process parse error
      return res.status(400).send(e.errors)
    }
  };

export const validateResourceAsync =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // try to parse schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (e: any) {
      // process parse error
      return res.status(400).send(e.errors);
    }
  };