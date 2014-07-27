define(function () {
    /**
     * @constructor
     * @param {Element} el DOM node
     * @param {Function} callback executed during mouse/touch drag
     * @param {Function} start (optional) executed onmousedown or ontouchstart
     * @param {Function} stop (optional) executed onmouseup or ontouchend
     */
    return function DragHandler (el, callback, start, stop) {
        var offsets = [0, 0];
        var buffer = null;
        const dummy = function () {return;}
        if (typeof start !== "function") { start = dummy; }
        if (typeof stop !== "function") { stop = dummy; }

        function getMatrix ( style ) {
            var buffer = null;
            if ( style.transform.match(/matrix/) ) {
                buffer = style.transform.replace(/matrix|\(|\)/g, "");
            } else {
                buffer = "matrix(1,0,0,1,0,0)"; // assign an identity matrix
            }
            return buffer.split(",");
        }

        el.addEventListener("mousedown", function (event) {
            buffer = window.getComputedStyle(el);
            buffer = getMatrix(buffer);
            const x = event.clientX;
            const y = event.clientY;
            offsets[0] = parseInt(buffer[4]) - x;
            offsets[1] = parseInt(buffer[5]) - y;
            document.addEventListener("mouseup", removeMouseDragListener);
            document.addEventListener("mousemove", handleMouseDrag);
            start.call(el, x,y,0, event);
        });

        el.addEventListener("touchstart", function (event) {
            buffer = window.getComputedStyle(el);
            buffer = getMatrix(buffer);
            const x = event.touches[0].clientX;
            const y = event.touches[0].clientY;
            offsets[0] = parseInt(buffer[4]) - x;
            offsets[1] = parseInt(buffer[5]) - y;
            document.addEventListener("touchend", removeTouchDragListener);
            document.addEventListener("touchmove", handleTouchDrag);
            start.call(el, x,y,0, event);
        });

        // mouse 
        function removeMouseDragListener (event) {
            const x = event.clientX;
            const y = event.clientY;
            document.removeEventListener("mousemove", handleMouseDrag);
            document.removeEventListener("mouseup", removeMouseDragListener);
            stop.call(el, x,y,0);
        }
        function handleMouseDrag (event) {
            const x = event.clientX;
            const y = event.clientY;
            const xrel = offsets[0] + x;
            const yrel = offsets[1] + y;
            callback.call(el, xrel,yrel,0, x, y);
        }

        // touches
        function handleTouchDrag (event) {
            const x = event.touches[0].clientX;
            const y = event.touches[0].clientY;
            const xrel = offsets[0] + x;
            const yrel = offsets[0] + y;
            callback.call(el, xrel,yrel,0, x,y);
        }
        function removeTouchDragListener (event) {
            document.removeEventListener("touchmove", handleTouchDrag);
            document.removeEventListener("touchend", removeTouchDragListener);
            const x = offsets[0] + event.changedTouches[0].clientX;
            const y = offsets[0] + event.changedTouches[0].clientY;
            stop.call(el, x,y,0);
        }

    }
});
