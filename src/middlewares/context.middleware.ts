// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import requestContext from 'request-context';

export const contextMiddleware = requestContext.middleware('request');
