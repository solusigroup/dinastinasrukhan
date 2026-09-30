import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:18
 * @route '/chat'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
export const getMessages = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMessages.url(args, options),
    method: 'get',
})

getMessages.definition = {
    methods: ["get","head"],
    url: '/chat/{user}/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
getMessages.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return getMessages.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
getMessages.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMessages.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
getMessages.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMessages.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
    const getMessagesForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMessages.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
        getMessagesForm.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMessages.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:134
 * @route '/chat/{user}/messages'
 */
        getMessagesForm.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMessages.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMessages.form = getMessagesForm
/**
* @see \App\Http\Controllers\ChatController::bulkBroadcast
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/bulk-broadcast'
 */
export const bulkBroadcast = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkBroadcast.url(options),
    method: 'post',
})

bulkBroadcast.definition = {
    methods: ["post"],
    url: '/chat/bulk-broadcast',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::bulkBroadcast
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/bulk-broadcast'
 */
bulkBroadcast.url = (options?: RouteQueryOptions) => {
    return bulkBroadcast.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::bulkBroadcast
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/bulk-broadcast'
 */
bulkBroadcast.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkBroadcast.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ChatController::bulkBroadcast
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/bulk-broadcast'
 */
    const bulkBroadcastForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkBroadcast.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::bulkBroadcast
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/bulk-broadcast'
 */
        bulkBroadcastForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkBroadcast.url(options),
            method: 'post',
        })
    
    bulkBroadcast.form = bulkBroadcastForm
/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:177
 * @route '/chat/{user}'
 */
export const store = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/chat/{user}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:177
 * @route '/chat/{user}'
 */
store.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return store.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:177
 * @route '/chat/{user}'
 */
store.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:177
 * @route '/chat/{user}'
 */
    const storeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChatController::store
 * @see app/Http/Controllers/ChatController.php:177
 * @route '/chat/{user}'
 */
        storeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const ChatController = { index, getMessages, bulkBroadcast, store }

export default ChatController