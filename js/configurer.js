define(["utils/extend"], function (extend) {
    return function configurer (defaults, user) {
        return extend(defaults, user);
    };
});

