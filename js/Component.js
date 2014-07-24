define([
    "Templates",
    "configurer",
    "audioContext"
], function (Templates, configurer, audioContext) {

    const COMPONENT_DEFAULTS = {
        el: null,
        type: null,
        draggable: true
    };

    /**
     * @constructor
     * Base class for components, sets up the base template and  
     */
    function Component (config) {
        const that = this;
        config = configurer(COMPONENT_DEFAULTS, config);
        
        this.node = (config.type !== null) ? audioContext["create"+config.type]() : null;
        var docfrag = Templates("component");
        this.el = docfrag.querySelector("div");

        var originalEvent = null;
        var offsets = [0, 0];
        var buffer = null;

        // TODO: deal with the config object...
        if ( config.draggable ) {
            this.el.addEventListener("mousedown", function (event) {
                buffer = window.getComputedStyle(this);
                buffer = buffer.transform.replace(/matrix|\(|\)/g, "").split(",");
                offsets[0] = parseInt(buffer[4]) - event.clientX;
                offsets[1] = parseInt(buffer[5]) - event.clientY;
                document.addEventListener("mouseup", removeMouseDragListener);
                document.addEventListener("mousemove", handleMouseDrag);
            });
        }

        /* local functions */

        // TODO: touch handlers

        function removeMouseDragListener (event) {
            document.removeEventListener("mousemove", handleMouseDrag);
            document.removeEventListener("mouseup", removeMouseDragListener);
        }
        function handleMouseDrag (event) {
            const y = offsets[1] + event.clientY + "px";
            const x = offsets[0] + event.clientX + "px";
            that.el.style.transform = "translate3d("+x+","+y+", 0)";
        }
        
        return this;
    }

    Component.prototype.connect = function(node) {
        this.node.connect(node);
    };
    Component.prototype.disconnect = function() {
        this.node.disconnect();
    };
    Component.prototype.start = function() {
        this.node.start();
    };
    Component.prototype.stop = function() {
        this.node.stop();
    };

    return Component;
});
