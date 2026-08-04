import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
export const gallery = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery.url(options),
    method: 'get',
})

gallery.definition = {
    methods: ["get","head"],
    url: '/gallery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
gallery.url = (options?: RouteQueryOptions) => {
    return gallery.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
gallery.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
gallery.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: gallery.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
    const galleryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: gallery.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
        galleryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: gallery.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::gallery
 * @see app/Http/Controllers/FamilyMemberController.php:273
 * @route '/gallery'
 */
        galleryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: gallery.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    gallery.form = galleryForm
/**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/family-members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::index
 * @see app/Http/Controllers/FamilyMemberController.php:18
 * @route '/family-members'
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
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/family-members/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::create
 * @see app/Http/Controllers/FamilyMemberController.php:38
 * @route '/family-members/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\FamilyMemberController::store
 * @see app/Http/Controllers/FamilyMemberController.php:64
 * @route '/family-members'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/family-members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::store
 * @see app/Http/Controllers/FamilyMemberController.php:64
 * @route '/family-members'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::store
 * @see app/Http/Controllers/FamilyMemberController.php:64
 * @route '/family-members'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::store
 * @see app/Http/Controllers/FamilyMemberController.php:64
 * @route '/family-members'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::store
 * @see app/Http/Controllers/FamilyMemberController.php:64
 * @route '/family-members'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
export const show = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/family-members/{family_member}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
show.url = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { family_member: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    family_member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        family_member: args.family_member,
                }

    return show.definition.url
            .replace('{family_member}', parsedArgs.family_member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
show.get = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
show.head = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
    const showForm = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
        showForm.get = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::show
 * @see app/Http/Controllers/FamilyMemberController.php:112
 * @route '/family-members/{family_member}'
 */
        showForm.head = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
export const edit = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/family-members/{family_member}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
edit.url = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { family_member: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    family_member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        family_member: args.family_member,
                }

    return edit.definition.url
            .replace('{family_member}', parsedArgs.family_member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
edit.get = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
edit.head = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
    const editForm = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
        editForm.get = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::edit
 * @see app/Http/Controllers/FamilyMemberController.php:124
 * @route '/family-members/{family_member}/edit'
 */
        editForm.head = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
export const update = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/family-members/{family_member}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
update.url = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { family_member: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    family_member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        family_member: args.family_member,
                }

    return update.definition.url
            .replace('{family_member}', parsedArgs.family_member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
update.put = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
update.patch = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
    const updateForm = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
        updateForm.put = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::update
 * @see app/Http/Controllers/FamilyMemberController.php:154
 * @route '/family-members/{family_member}'
 */
        updateForm.patch = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\FamilyMemberController::destroy
 * @see app/Http/Controllers/FamilyMemberController.php:232
 * @route '/family-members/{family_member}'
 */
export const destroy = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/family-members/{family_member}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::destroy
 * @see app/Http/Controllers/FamilyMemberController.php:232
 * @route '/family-members/{family_member}'
 */
destroy.url = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { family_member: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    family_member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        family_member: args.family_member,
                }

    return destroy.definition.url
            .replace('{family_member}', parsedArgs.family_member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::destroy
 * @see app/Http/Controllers/FamilyMemberController.php:232
 * @route '/family-members/{family_member}'
 */
destroy.delete = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::destroy
 * @see app/Http/Controllers/FamilyMemberController.php:232
 * @route '/family-members/{family_member}'
 */
    const destroyForm = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::destroy
 * @see app/Http/Controllers/FamilyMemberController.php:232
 * @route '/family-members/{family_member}'
 */
        destroyForm.delete = (args: { family_member: string | number } | [family_member: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
export const tree = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tree.url(options),
    method: 'get',
})

tree.definition = {
    methods: ["get","head"],
    url: '/family-tree',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
tree.url = (options?: RouteQueryOptions) => {
    return tree.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
tree.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tree.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
tree.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tree.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
    const treeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tree.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
        treeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tree.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FamilyMemberController::tree
 * @see app/Http/Controllers/FamilyMemberController.php:261
 * @route '/family-tree'
 */
        treeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tree.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tree.form = treeForm
const FamilyMemberController = { gallery, index, create, store, show, edit, update, destroy, tree }

export default FamilyMemberController