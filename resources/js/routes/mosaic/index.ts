import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mosaic',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMosaicController::index
 * @see app/Http/Controllers/FamilyMosaicController.php:21
 * @route '/mosaic'
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
* @see \App\Http\Controllers\FamilyMosaicController::store
 * @see app/Http/Controllers/FamilyMosaicController.php:126
 * @route '/mosaic'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mosaic',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FamilyMosaicController::store
 * @see app/Http/Controllers/FamilyMosaicController.php:126
 * @route '/mosaic'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMosaicController::store
 * @see app/Http/Controllers/FamilyMosaicController.php:126
 * @route '/mosaic'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FamilyMosaicController::store
 * @see app/Http/Controllers/FamilyMosaicController.php:126
 * @route '/mosaic'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FamilyMosaicController::store
 * @see app/Http/Controllers/FamilyMosaicController.php:126
 * @route '/mosaic'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FamilyMosaicController::update
 * @see app/Http/Controllers/FamilyMosaicController.php:158
 * @route '/mosaic/{mosaic}'
 */
export const update = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/mosaic/{mosaic}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\FamilyMosaicController::update
 * @see app/Http/Controllers/FamilyMosaicController.php:158
 * @route '/mosaic/{mosaic}'
 */
update.url = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mosaic: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mosaic: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mosaic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mosaic: typeof args.mosaic === 'object'
                ? args.mosaic.id
                : args.mosaic,
                }

    return update.definition.url
            .replace('{mosaic}', parsedArgs.mosaic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMosaicController::update
 * @see app/Http/Controllers/FamilyMosaicController.php:158
 * @route '/mosaic/{mosaic}'
 */
update.put = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\FamilyMosaicController::update
 * @see app/Http/Controllers/FamilyMosaicController.php:158
 * @route '/mosaic/{mosaic}'
 */
    const updateForm = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FamilyMosaicController::update
 * @see app/Http/Controllers/FamilyMosaicController.php:158
 * @route '/mosaic/{mosaic}'
 */
        updateForm.put = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\FamilyMosaicController::destroy
 * @see app/Http/Controllers/FamilyMosaicController.php:211
 * @route '/mosaic/{mosaic}'
 */
export const destroy = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/mosaic/{mosaic}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FamilyMosaicController::destroy
 * @see app/Http/Controllers/FamilyMosaicController.php:211
 * @route '/mosaic/{mosaic}'
 */
destroy.url = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mosaic: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { mosaic: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    mosaic: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mosaic: typeof args.mosaic === 'object'
                ? args.mosaic.id
                : args.mosaic,
                }

    return destroy.definition.url
            .replace('{mosaic}', parsedArgs.mosaic.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMosaicController::destroy
 * @see app/Http/Controllers/FamilyMosaicController.php:211
 * @route '/mosaic/{mosaic}'
 */
destroy.delete = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FamilyMosaicController::destroy
 * @see app/Http/Controllers/FamilyMosaicController.php:211
 * @route '/mosaic/{mosaic}'
 */
    const destroyForm = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FamilyMosaicController::destroy
 * @see app/Http/Controllers/FamilyMosaicController.php:211
 * @route '/mosaic/{mosaic}'
 */
        destroyForm.delete = (args: { mosaic: number | { id: number } } | [mosaic: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const mosaic = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default mosaic