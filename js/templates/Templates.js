define([
"text!templates/component.html",
"text!templates/toolBar.html"
], function(component, toolBar) {

    // IMPORT ALL TEMPLATES, WRAP THEM IN <template>

    const templates = {
        component: component,
        toolBar : toolBar
    };
    const domParser = new DOMParser();
    const templateGroup = document.createElement("div");
    var nodes = null;
    var templateString = "";
    var i = 0;
    for (var template in templates) {
        templateString += "<template name=\""+template+"\">" + templates[template] + "</template>";
    }
    nodes = domParser.parseFromString(templateString, "text/html").querySelectorAll("head > template");
    for (i=0; i<nodes.length; i++) { templateGroup.appendChild(nodes[i]); }

    templateGroup.hidden = true;
    document.body.appendChild(templateGroup);

    /**
     * @factory
     */
    function Templates (name, templateData) {
        var template = templateGroup.querySelector("template[name="+name+"]");
        return document.importNode(template.content, true);
    };

    Templates.names = (function() { var n=[]; for (var t in templates) n.push(t); return n; })();

    return Templates;

});
