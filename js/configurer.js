define(["utils/extend"], function (extend) {
    /** 
     * @param {object} context DEPRECATED 
     */
    return function configurer (defaults, user, context) {
        var configuration = extend(defaults, user);
        if (context) {
            configuration = extend(context, configuration);
        }
        return configuration;
    };
});

