(function (window) {
    "use strict";
    function define() {
        var brush = {};
        //UTILS
        var err = function (message) {
            var e = new Error(message); // e.name is 'Error'


            throw e;

        }
        var warn = function (message, name) {
            if (name) {
                name = name + " ";
            } else {
                name = "";
            }
            if (console.warn) {
                console.warn("BrushJS " + name + "warning: " + message);
            } else {
                console.log("BrushJS " + name + "warning: " + message);
            }
        }

        brush.Canvas = function (selector) {
            if (!(this instanceof brush.Canvas)) {
                warn("The 'new' constructor was not used when creating a new canvas. A new instance of brush.Canvas was created.", "CanvasCreation")
                return new brush.Canvas(selector);
            }
            var selectorMatches = document.querySelectorAll(selector);
            if (selectorMatches.length > 1) {
                warn("Mutiple elements matched the selector '" + selector + "'. The first element was used to construct the canvas.", "CanvasCreation")
            } else if (selectorMatches.length <= 0 || selectorMatches == null) {
                err("No elements matched the selector '" + selector + "'. No canvas was created.", "CanvasCreation");
                return;
            }
            var canvas = selectorMatches[0];
            var ctx = canvas.getContext("2d");
            var currentColor = [255, 0, 0, 1];//r, g, b, a
            ctx.setColor = function (r, g, b, a) {
                var hex;
                if (arguments.length === 1) {
                    //https://stackoverflow.com/a/21648508/5511561
                    //assume that the only argument is an hexadecimal string, and convert into rgba.
                    var c;
                    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
                        c = hex.substring(1).split('');
                        if (c.length == 3) {
                            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
                        }
                        c = '0x' + c.join('');
                        //return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
                        r = (c >> 16) & 255;
                        g = (c >> 8) & 255;
                        b = c & 255;
                        a = 1;

                    }
                    err("Bad Hex '" + r + "' provided");
                } else {

                }
            }
            ctx.sprite = function (url, x, y, width, height) {
                if (!(this instanceof ctx.sprite)) {
                    warn("The 'new' constructor was not used when creating a new sprite. A new instance of Canvas.sprite was created.", "CanvasCreation")
                    return new ctx.sprite();
                }
                ctx.fillStyle = "rgba(" + currentColor.join(',') + ")";
                if (url == "brush.js:rectangle") {
                    ctx.fillRect(x, y, width, height);
                } else {
                    var img = new Image();
                    img.onload = function () {
                        ctx.drawImage(img, x, y);
                    }
                    img.src = url;
                    width = img.width;
                    height = img.height;
                }

                this.moveto = function (newx, newy) {
                    console.log(width);
                    //clear image
                    var newimg = ctx.createImageData(width, height);
                    for (var i = newimg.data.length; --i >= 0;)
                        newimg.data[i] = 0;
                    ctx.putImageData(newimg, x, y);
                    //add new image
                    ctx.drawImage(img, newx, newy);
                    x = newx;
                    y = newy;
                }
                this.animateto = function (newx, newy, ms) {
                    var parent = this;
                    ms = ms || 800;
                    var frame = 0;
                    var currx = x;
                    var curry = y;
                    var interval = setInterval(function(){
                        console.log(frame)
                        if (frame > 10) {
                            console.log(1)
                            clearInterval(interval);
                            console.log(2)
                            return;
                        }
                        currx ++;
                        curry ++;
                        parent.moveto(currx, curry);

                    }, 5);
                }
                this.getX = function () {
                    return x;
                }
                this.getY = function () {
                    return y;
                }
                canvas.addEventListener("mousedown", getPosition, false);

                function getPosition(event) {
                    var boundary = canvas.getBoundingClientRect();

                    var clickx = event.clientX - boundary.left;
                    var clicky = event.clientY - boundary.top;


                    if ((clickx > x && clickx < (x + width)) && (clicky > y && clicky < (y + height))) {
                        console.log("clicked inside rectangle")
                    }
                }
            }

            return ctx;
        }
        return brush;
    }
    //define globally if it doesn't already exist
    if (typeof (brush) === 'undefined') {
        window.brush = define();
    }
    else {
        throw new Error("The variable 'brush' was already defined, so could not define Brush.JS.", "Definition");
    }
})(window);