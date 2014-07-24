define(["Templates", "configurer"], function(Templates, configurer) {

    const TOOLBAR_DEFAULTS = {
        hidden: true,
        tools: []
    };

    function hide() {

        this.el.classList.add("hide");
    }

    function Toolbar (config) {
        var that = this;
        this.config = configurer(TOOLBAR_DEFAULTS, config);
        var docfrag = Templates("toolbar");
        this.el = docfrag.querySelector("div");

        if (this.config.hidden) { hide.call(this); }

        this.el.querySelector(".open").onclick = function() {
            if (that.config.hidden) { that.toggle(); } 
        };
        this.el.querySelector(".close").onclick = function() {
            if (!that.config.hidden) { that.toggle(); } 
        };
    }

    Toolbar.prototype.toggle = function () {
        if (this.config.hidden) {
            this.el.classList.remove("hide"); 
        } else { this.el.classList.add("hide"); }
        this.config.hidden = !this.config.hidden;
        return this;
    };

    return Toolbar;
});
