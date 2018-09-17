# Scalo
A lightweight scripting language for creating SVG files and animations.

Check out the current [live alpha build](https://ian-colcanon.github.io/Scalo/).

## About
This repository contains the UI for a browser-based language project. This was started in January of 2018 as an undegraduate research project, which I have continued to develop since. The Scalo language simplifies the process of creating scalable images that involve repetitive patterns, such as gridlines or concentric circles. It also provides support for scalable animations in a limit-based format.

## Quick Start
Scalo is an object oriented language, at the core of which is the "Shape" object.
```
r = rect(0,0,30,30)
//x: 0
//y: 0
//width: 30
//height: 30

c = circle(0,0,40)
//cx: 0
//cy: 0
//r: 40
```
In addition to Shape objects, Scalo supports the following primitive types. As seen above, Scalo is not a strictly typed language, so be careful when declaring variables.
```
s = "this is a string"
i = 24601
r = 2.4601
```

