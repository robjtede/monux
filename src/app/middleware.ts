import { Middleware, MiddlewareAPI, Dispatch, Action } from 'redux'
import promiseMiddleware from 'redux-promise-middleware'

export const logger: Middleware = <S>(store: MiddlewareAPI<S>) => (
  next: Dispatch<S>
) => <A extends Action>(action: A): A => {
  console.info('dispatching', <A>action)
  const result = next(<A>action)
  console.info('next state', <S>store.getState())
  return result
}

export const middleware: Middleware[] = [promiseMiddleware()]
