define(function () {
    return function (x, y) {
        for (var property in y) {
            x[property] = y[property];
        }
        return x;
    }
});
