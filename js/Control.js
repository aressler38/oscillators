define([
    "Templates", 
    "configurer"
],function (Templates, configurer) {

   
    /**
     * @constructor
     */
    function Control (config) {
        const CONTROL_DEFAULTS = {
            type: "frequency",
            template: "slider",
            value: 110,
            min: 0,
            max: 1,
            step: 1,
            filter: function (value) { return value; }  // default identity function
        };
        var that = this;
        config = configurer(CONTROL_DEFAULTS, config);
        const docfrag = Templates(config.template);
        this.el = docfrag.querySelector("div");

        var slider = this.el.querySelector("input[type=\"range\"]");
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = config.value;

        var text = this.el.querySelector(".slider-value");

        // proxy to prototype method for user access
        slider.addEventListener("input", function (event) {
            var filter = config.filter;
            that.oninput(filter(this.value));
            text.value = filter(this.value);
        });

        var min = this.el.querySelector(".control-setting.min");
        var max = this.el.querySelector(".control-setting.max");
        var step = this.el.querySelector(".control-setting.step")

        min.value = config.min;
        max.value = config.max;
        step.value = config.step;

        /* private event handlers */
        min.addEventListener("input", function (event) {
            slider.min = this.value;
        });
        max.addEventListener("input", function (event) {
            slider.max = this.value;
        });
        step.addEventListener("input", function (event) {
            slider.step = this.value;
        });

        return this;
    }

    /** @callback */
    Control.prototype.oninput = function() { };

    return Control;
});
