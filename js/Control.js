define([
    "Templates", 
    "configurer"
],function (Templates, configurer) {

    const CONTROL_DEFAULTS = {
        type: "frequency",
        template: "knob"
    };
   
    /**
     * @constructor
     */
    function Control (config) {
        var that = this;
        config = configurer(CONTROL_DEFAULTS, config);
        const docfrag = Templates(config.template);
        this.el = docfrag.querySelector("div");

        this.el.querySelector("input[type=\"range\"]").addEventListener("input", function (event) {
            that.oninput(this.value);
        });

        return this;
    }

    Control.prototype.oninput = function() { };

    return Control;
});
