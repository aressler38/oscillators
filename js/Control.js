define([
    "Templates", 
    "configurer"
],function() {

    const CONTROL_DEFAULTS = {
        type: "frequency",
        template: "knob"
    };
   
    /**
     * @constructor
     */
    function Control (config) {
        config = configurer(CONTROL_DEFAULTS, config);
        const docfrag = Templates(config.template);
        this.el = docfrag.querySelector("div");

        
        return this;
    }
    return Control;
});
