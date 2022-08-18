import { Request } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import {
  ArraySchema,
  BinarySchema,
  BooleanSchema,
  DateSchema,
  FunctionSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
  SymbolSchema,
} from 'joi';
// import { DatabaseHelper } from '../../mikro-orm.config';

// declare global {
//   namespace Express {
//     export interface Request {
//       db: DatabaseHelper;
//     }
//   }
// }

export type RequestPayload = { body?: object, params?: object, query?: object };

type PayloadDictionary<T> = {
  [P in keyof T]: T[P] extends StringSchema
    ? string
    : T[P] extends NumberSchema
      ? number
      : T[P] extends BooleanSchema
        ? boolean
        : T[P] extends FunctionSchema
          ? Function
          : T[P] extends ArraySchema
            ? Array<any>
            : T[P] extends DateSchema
              ? Date
              : T[P] extends BinarySchema
                ? Buffer
                : T[P] extends ObjectSchema
                  ? Object
                  : T[P] extends SymbolSchema
                    ? symbol
                    : any;
};

export interface TypedRequest<A extends RequestPayload> extends Request {
  body: Required<PayloadDictionary<A['body']>>,
  params: Required<PayloadDictionary<A['params']>> & Omit<ParamsDictionary, any>,
  query: Required<PayloadDictionary<A['query']>> & Omit<Query, any>
}
