const queryString = require('query-string');
const z = require('zod');

const Routes = {
    home: makeRoute(() => '/'),

    scalar: makeRoute(() => '/scalar'),

    terms: makeRoute(() => '/terms'),
    privacy: makeRoute(() => '/privacy'),

    login: makeRoute(() => '/login'),

    getStarted: makeRoute(() => '/get-started'),
    verify: makeRoute(
        () => '/get-started/verify',
        z.object({}),
        z.object({ email: z.string().email() })
    ),

    secret: makeRoute(() => '/secret'),
};

function makeRoute(fn, _paramsSchema = z.object({}), _search = z.object({})) {
    const routeBuilder = (params, options) => {
        const baseUrl = fn(params);
        const searchString = options?.search && queryString.stringify(options.search);
        return [baseUrl, searchString ? `?${searchString}` : ''].join('');
    };

    // Set the runtime getter
    Object.defineProperty(routeBuilder, 'params', {
        get() {
            throw new Error(
                'Routes.[route].params is only for type usage, not runtime. Use it like `typeof Routes.[routes].params`'
            );
        },
    });

    return routeBuilder;
}

module.exports = {
    Routes,
    makeRoute
};