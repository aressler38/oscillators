define(function() {
    function getMatrix ( style ) {
        var buffer = null;
        if ( style.transform.match(/matrix/) ) {
            buffer = style.transform.replace(/matrix|\(|\)/g, "");
        } else {
            buffer = "matrix(1,0,0,1,0,0)"; // assign an identity matrix
        }
        return buffer.split(",").map(function(x){return parseInt(x)});
    }
    return getMatrix;
});
