import { ISession } from '../controllers/session';

export interface IPunditDef {
  [key: string]: (user: ISession, record?: any) => boolean;
}
export function pundit<T extends IPunditDef>(inputs: T) {
  return <K = any>(user: ISession, record?: K) =>
    new Proxy<any>(inputs, {
      get: (obj: T, key: string) => {
        return obj[key](user, record);
      }
    }) as { [k in keyof T]: boolean };
}
