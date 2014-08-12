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
        this.currentNode = this.el.querySelector(".current-node");
        this.controls = this.el.querySelector(".tool-control .controls");

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

    /**
     * @method
     * Set the header title of the tool bar
     */
    Toolbar.prototype.setToolName = function (name) {
        // clear
        while (this.currentNode.childNodes.length) {
            this.currentNode.removeChild(this.currentNode.lastChild);
        }
        this.currentNode.appendChild(document.createTextNode(name));
    };

    Toolbar.prototype.addControl = function (control) {
        for (var i=0; i<arguments.length; i++) {
            this.controls.appendChild(arguments[i].el);
        }
    };

    Toolbar.prototype.clearControls = function () {
        while (this.controls.childNodes.length) {
            this.controls.removeChild(this.controls.lastChild);
        }
        return this;
    };

    return Toolbar;
});
