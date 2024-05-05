import { operations } from '../../data/dropinblog.api';

export type Response = operations['authors-list']['responses']['200']['content']['application/json'];
export type Data = NonNullable<Response['data']>;
export type Author = NonNullable<Data['authors']>[0];