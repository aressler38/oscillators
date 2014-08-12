define(function() {
    const rMatrix = /matrix/;
    const rMatrixReplace = /matrix|\(|\)/g;
    const IDENTITY_MATRIX_STR = "matrix(1,0,0,1,0,0)";
    function getMatrix ( style ) {
        var buffer = null;
        if ( style.transform.match(rMatrix) ) {
            buffer = style.transform.replace(rMatrixReplace, "");
        } else {
            buffer = IDENTITY_MATRIX_STR; // default identity matrix
        }
        return buffer.split(",").map(function(x){return parseInt(x)});
    }
    return getMatrix;
});
