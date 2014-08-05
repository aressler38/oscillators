define(function() {

    const COMPONENTS_CONFIG = {
        selectClass : "selected"
    };

    /**
     * @constructor
     * A data structure to keep track of attached components to the App.
     */
    function Components () {
        this.list = [];
        this.selected = null;
    }

    Components.prototype.length = 0;

    Components.prototype.add = function (component) {
        var hash = component.type+"_"+this.length; // TODO: not really a hash
        this[hash] = component;
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

    /**
     * We are only allowing 1 selected component per selection at this time.
     */
    Components.prototype.select = function (hash) {
        // unselect current el first
        if ( this.selected ) {
            this.selected.el.classList.remove(COMPONENTS_CONFIG.selectClass);
        }
        if ( this[hash] ) {
            this.selected = this[hash];
            this.selected.el.classList.add(COMPONENTS_CONFIG.selectClass);
        } else { throw "no hash"; }
    };

    return Components;
});
