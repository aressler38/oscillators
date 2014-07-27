define(["utils/extend"], function (extend) {
    return function configurer (defaults, user) {
        extend(defaults, user);
        return extend(this, defaults);
    };
});

