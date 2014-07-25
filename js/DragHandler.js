define(function () {
    /**
     * @constructor
     * @param {Element} el DOM node
     * @param {Function} callback executed during mouse/touch drag
     */
    return function DragHandler (el, callback) {
        var offsets = [0, 0];
        var buffer = null;
        el.addEventListener("mousedown", function (event) {
            buffer = window.getComputedStyle(el);
            buffer = buffer.transform.replace(/matrix|\(|\)/g, "").split(",");
            offsets[0] = parseInt(buffer[4]) - event.clientX;
            offsets[1] = parseInt(buffer[5]) - event.clientY;
            document.addEventListener("mouseup", removeMouseDragListener);
            document.addEventListener("mousemove", handleMouseDrag);
        });

        el.addEventListener("touchstart", function (event) {
            buffer = window.getComputedStyle(el);
            buffer = buffer.transform.replace(/matrix|\(|\)/g, "").split(",");
            offsets[0] = parseInt(buffer[4]) - event.touches[0].clientX;
            offsets[1] = parseInt(buffer[5]) - event.touches[0].clientY;
            document.addEventListener("touchend", removeTouchDragListener);
            document.addEventListener("touchmove", handleTouchDrag);
        });

        // mouse 
        function removeMouseDragListener (event) {
            document.removeEventListener("mousemove", handleMouseDrag);
            document.removeEventListener("mouseup", removeMouseDragListener);
        }
        function handleMouseDrag (event) {
            const x = offsets[0] + event.clientX + "px";
            const y = offsets[1] + event.clientY + "px";
            callback.call(el, x,y,0);
        }

        // touches
        function handleTouchDrag (event) {
            const x = offsets[0] + event.touches[0].clientX + "px";
            const y = offsets[0] + event.touches[0].clientY + "px";
            callback.call(el, x,y,0);
        }
        function removeTouchDragListener (event) {
            document.removeEventListener("touchmove", handleTouchDrag);
            document.removeEventListener("touchend", removeTouchDragListener);
        }

    }
});
