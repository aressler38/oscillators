define([
    "Templates", 
    "configurer"
],function (Templates, configurer) {
    
    /**
     * @constructor
     * This class shouldn't require a fully-fledged template file. It is a clickable div.
     */
    function Button (config) {
        const BUTTON_DEFAULTS = {
            classList: ""
        };
        var that = this;
        config = configurer(BUTTON_DEFAULTS, config);
        this.el = document.createElement("div");
        this.el.setAttribute("class", config.classList);
        this.el.addEventListener("click", function(event) { this.onclick(event); }.bind(this));
        return this;
    }

    Button.prototype.onclick = function (event) {};

    return Button;
});
