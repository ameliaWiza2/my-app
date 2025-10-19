type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type MockResponseResolver = (body?: unknown) => unknown;

type MockResponseMap = Record<string, MockResponseResolver | unknown>;

type MockRegistry = Partial<Record<HttpMethod, MockResponseMap>>;

const registry: MockRegistry = {
  get: {
    '/user/profile': () => ({
      id: 'user-1',
      name: 'Sample User',
      email: 'sample@example.com',
    }),
  },
  patch: {
    '/user/profile': body => {
      const nextName = typeof body === 'object' && body !== null && 'name' in body ? (body as {name?: string}).name : undefined;
      return {
        id: 'user-1',
        name: nextName ?? 'Sample User',
        email: 'sample@example.com',
      };
    },
  },
};

export const resolveMock = (method: HttpMethod, url: string, body?: unknown) => {
  const mocks = registry[method];
  if (!mocks) {
    return undefined;
  }
  const match = mocks[url];
  if (!match) {
    return undefined;
  }
  if (typeof match === 'function') {
    return (match as MockResponseResolver)(body);
  }
  return match;
};
