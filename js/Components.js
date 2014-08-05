define(function() {


    /**
     * @constructor
     * A data structure to keep track of attached components to the App.
     */
    function Components () {

        this.list = [];
    }

    Components.prototype.length = 0;

    Components.prototype.add = function (component) {
        var hash = "_"+this.length; // TODO: not really a hash
        this[component.type+hash] = component;
        component.el.dataset.hash = hash;
        this.list.push(component);
        this.length++;
    };

    Components.prototype.computeStyles = function () {
        var i=0, len=this.list.length;
        for (; i<len; i++) {
            this.list[i].computeStyle();
        }
    };

    return Components;
});
