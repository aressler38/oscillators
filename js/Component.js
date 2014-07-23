define([
    "Templates",
    "utils/extend",
    "audioContext"
], function (Templates, extend, audioContext) {

    /**
     * @constructor
     * Base class for components, sets up the base template and  
     */
    function Component (config) {
        config = extend({
            el: null,
            type: null,
            draggable: true
        }, config);
        
        this.node = (config.type !== null) ? audioContext["create"+config.type]() : null;
        this.docfrag = Templates("component");
        this.el = this.docfrag.querySelector("*");

        var originalEvent = null;
        var offsets = [0, 0];
        var buffer = null;
        if ( config.draggable ) {
            this.el.addEventListener("mousedown", function (event) {
                //console.debug("mousedown");
                buffer = window.getComputedStyle(this);
                buffer = buffer.transform.replace(/matrix|\(|\)/g, "").split(",");
                offsets[0] = parseInt(buffer[4]) - event.clientX;
                offsets[1] = parseInt(buffer[5]) - event.clientY;
                document.addEventListener("mouseup", removeMouseDragListener);
                document.addEventListener("mousemove", handleMouseDrag);
            });
        }

        function removeMouseDragListener (event) {
            //console.debug("mouseup");
            document.removeEventListener("mousemove", handleMouseDrag);
            document.removeEventListener("mouseup", removeMouseDragListener);
        }
        var that = this;
        function handleMouseDrag (event) {
            var y = offsets[1] + event.clientY + "px";
            var x = offsets[0] + event.clientX + "px";
            that.el.style.transform = "translate("+x+","+y+")";
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
