define(function () { return AudioContext ? new AudioContext() : new webkitAudioContext(); });
