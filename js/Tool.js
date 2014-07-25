define([
    "Templates",
    "configurer",
    "audioContext",
], function (Templates, configurer, audioContext, Control) {

    const TOOL_DEFAULTS = {
        type: "oscillator"
    };


    function Tool (config) {
        config = configurer(TOOL_DEFAULTS, config); 



    }

    return Tool;
});
