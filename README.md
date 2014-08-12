Oscillators
===========

This is a simple demonstration of the Web Audio API. 
Users are able to create, connect, and disconnect oscillators.
There is one tool bar that governs any variable parameters for a 
selected AudioNode. The tool bar also provides the ability to 
create new oscillator and gain nodes.

### Features
* Ability to add multiple oscillator or gain nodes and customize their parameters and interconnections.
* Mobile & Desktop compatible.
* HTML5 `<template>` usage.
* HTML5 Canvas rendered via `requestAnimationFrame` loop. 
* 'Smart' render loop, which will sleep when inactive to reduce CPU load.
* No external libraries other than require.js for loading AMD files.
