(function (window, document) {

	"use strict";

	var Ω = function (selector) {
		return _Ω.up(selector);
	};

	var _Ω = {

		//initialze empty object and dom sector

		obj: null,

		up: function (selector) {
			if (selector === undefined) {
				this.obj = document;
			} else {
				if (selector.currentTarget) {
					this.obj = selector.currentTarget;
				} else if (selector === document) {
					this.obj = document;
				} else if (selector === window) {
					this.obj = window;
				} else if (document.querySelectorAll(selector).length > 1) {
					this.obj = document.querySelectorAll(selector);
				} else {
					this.obj = document.querySelector(selector);
				}
			}
			return _Ω;
		},

		// force wait until DOM elements are loaded for js to run

		ready: function (fn) {
			this.obj.addEventListener("DOMContentLoaded", function () {
				fn();
			});
		},

		//general method to iterate through selected elements and apply the method

		loop: function (fn) {
			if (this.obj[0] === undefined) {
				return fn(this.obj);
			} else {
				var len = this.obj.length;
				for (var i = 0; i < len; i++) {
					fn(this.obj[i]);
				}
			}
		},

		// parent and child selectors

		parent: function () {
			this.obj = this.obj.parentNode;
			return _Ω;
		},

		child: function (x) {
			if (x) {
				this.obj = this.obj.childNodes[x - 1];
			} else {
				this.obj = this.obj.childNodes;
			}
			return _Ω;
		},

		//event listeners

		on: function (type, fn) {
			var _on = function (x) {
				if (x.addEventListener) {
					x.addEventListener(type, fn);
				} else if (x.attachEvent) {
					x.attachEvent(type, fn);
				}
			};
			this.loop(_on);
			return _Ω;
		},

		click: function (fn) {
			this.on('click', fn);
			return _Ω;
		},

		drag: function (fn) {
			this.on('drag', fn);
			return _Ω;
		},

		dragover: function (fn) {
			this.on('dragover', fn);
			return _Ω;
		},

		mouseover: function (fn) {
			this.on('mouseover', fn);
			return _Ω;
		},

		//DOM element methods

		append: function (element) {
			var _append = function (x) {
				x.appendChild(element);
			};
			this.loop(_append);
			return _Ω;
		},

		setBackground: function (color, url, options) {
			var _setBg = function (x) {
				x.style.background = color;
				if (url) {
					x.style.background = color + " url('" + url + "')";
				}
				if (options) {
					x.style.background = color + " url('" + url + "') " + options;
				}
			};
			this.loop(_setBg);
			return _Ω;
		},

		draggable: function () {

			var _draggable = function (x) {
				x.draggable = true;
				x.style.position = 'absolute';
				var oldStart = x.ondragstart;
				var oldDrag = x.ondrag;
				var oldOver = x.ondragover;
				var oldDrop = x.ondrop;
				var offset = {x: 0, y: 0};

				var firefox = !(window.mozInnerScreenX == null);
				var mozX;
				var mozY;

				if (firefox) {
					document.ondragover = function (e) {
						mozX = e.screenX;
						mozY = e.screenY;
					};
				}

				// if (oldStart) {
				// 	x.ondragstart = function (e) {
				// 		e.dataTransfer.setDragImage(x, -9999999999, -999999999);
				// 		offset.x = e.clientX - x.offsetLeft;
				// 		offset.y = e.clientY - x.offsetTop;
				// 		oldStart(e);
				// 	};
				// } else {
					x.ondragstart = function (e) {
						e.dataTransfer.setDragImage(x, -9999999999, -999999999);
						offset.x = e.clientX - x.offsetLeft;
						offset.y = e.clientY - x.offsetTop;
					};
				// }

				if (oldDrag) {
					x.ondrag = function (e) {
						var xpos,
								ypos;
						if (firefox) {
							xpos = mozX - offset.x;
							ypos = mozY - offset.y;
						} else {
							xpos = e.pageX - offset.x;
							ypos = e.pageY - offset.y;
						}
						x.style.left = Math.ceil(xpos) + "px";
						x.style.top = Math.ceil(ypos) + "px";
						oldDrag(e);
					};
				} else {
					x.ondrag = function (e) {
						var xpos,
								ypos;
						if (firefox) {
							xpos = mozX - offset.x;
							ypos = mozY - offset.y;
						} else {
							xpos = e.pageX - offset.x;
							ypos = e.pageY - offset.y;
						}
						x.style.left = Math.ceil(xpos) + "px";
						x.style.top = Math.ceil(ypos) + "px";
					};
				}

				if (oldOver) {
					x.ondragover = function (e) {
						e.preventDefault();
						oldOver(e);
						return false;
					};
				} else {
					x.ondragover = function (e) {
						e.preventDefault();
						return false;
					};
				}
				
				if (oldDrop) {
					x.ondrop = function (e) {
						e.preventDefault();
						oldDrop(e);
						return false;
					};
				} else {
					x.ondrop = function (e) {
						e.preventDefault();
						return false;
					};
				}
			};

			this.loop(_draggable);
			return _Ω;
		},

		hide: function () {
			var _hide = function (x) {
				x.style.display = "none";
			};
			this.loop(_hide);
			return _Ω;
		},

		show: function () {
			var _show = function (x) {
				x.style.display = "";
			};
			this.loop(_show);
			return _Ω;
		},

		toggleDisplay: function () {
			var _toggle = function (x) {
				if (x.style.display !== "none") {
					x.style.display = "none";
				} else {
					x.style.display = "";
				}
			};
			this.loop(_toggle);
			return _Ω;
		},

		itsClass: function (newclass) {
			var _itsClass = function (x) {
				if (newclass === undefined) {
					return x.className;
				} else {
					x.className = x.className + " " + newclass;
					return _Ω;
				}
			};
			return (this.loop(_itsClass) !== undefined) ? this.loop(_itsClass) : _Ω;
		},

		noClass: function () {
			var _noClass = function (x) {
				x.className = "";
			};
			this.loop(_noClass);
			return _Ω;
		},

		destroy: function () {
			var _destroy = function (x) {
				x.parentNode.removeChild(x);
			};
			this.loop(_destroy);
			return _Ω;
		},

		thisObj: function () {
			return this.obj;
		},

		duplicate: function () {
			var _duplicate = function (x) {
				if (x.tagName) {
					var me2 = document.createElement(x.nodeName);
					me2.prototype = x.prototype;
					me2.style = x.style;
					me2.src = x.src;
					me2.class = x.class;
					me2.style = x.style;
					me2.id = x.id + Math.floor(Math.random() * 1000);
					x.parentNode.appendChild(me2);
				}
			};
			this.loop(_duplicate);
			return _Ω;
		},

		mirror: function () {
			var _mirror = function (x) {
				if (
					x.style.transform !== "scaleX(-1)" &&
					x.style.mozTransform !== "scaleX(-1)" &&
					x.style.oTransform !== "scaleX(-1)" &&
					x.style.webkitTransform !== "scaleX(-1)" &&
					x.style.transform !== "scaleX(-1)" &&
					x.style.filter !== "FlipH" &&
					x.style.msFilter !== "FlipH"
				) {
					x.style.transform = "scaleX(-1)";
					x.style.mozTransform = "scaleX(-1)";
					x.style.oTransform = "scaleX(-1)";
					x.style.webkitTransform = "scaleX(-1)";
					x.style.transform = "scaleX(-1)";
					x.style.filter = "FlipH";
					x.style.msFilter = "FlipH";
				} else {
					x.style.transform =
					x.style.mozTransform =
					x.style.oTransform =
					x.style.webkitTransform =
					x.style.transform =
					x.style.filter =
					x.style.msFilter = "";
				}
			};
			this.loop(_mirror);
			return _Ω;
		},

		zup: function () {
			var _zup = function (x) {
				x.style.zIndex++;
			};
			this.loop(_zup);
			return _Ω;
		},

		zdown: function () {
			var _zup = function (x) {
				x.style.zIndex--;
			};
			this.loop(_zup);
			return _Ω;
		},

		//canvas methods

		noWhite:  function () {
			var _noWhite = function (x) {
				var can = document.createElement("canvas");
				can.height = x.height;
				can.width = x.width;
				can.id = x.id + "_nobg";
				can.style.cssText = x.style.cssText;
				x.parentNode.appendChild(can);
				var canv = can.getContext("2d");
				canv.drawImage(x, 0, 0);
				var data = canv.getImageData(0, 0, x.width, x.height);
				for (var i = 0; i < data.data.length; i += 4) {
					if (data.data[i] + data.data[i + 1] + data.data[i + 2] > 720) {
						data.data[i + 3] = 0;
					} else if (data.data[i] + data.data[i + 1] + data.data[i + 2] > 550) {
						data.data[i + 3] = 200;
					}
				}
				canv.putImageData(data, 0, 0);
				var dataURL = can.toDataURL();
				x.src = dataURL;
				can.parentNode.removeChild(can);
			};
			this.loop(_noWhite);
			return _Ω;
		},

		noBlack:  function () {
			var _noBlack = function (x) {
				var can = document.createElement("canvas");
				can.height = x.height;
				can.width = x.width;
				can.id = x.id + "_nobg";
				can.style.cssText = x.style.cssText;
				x.parentNode.appendChild(can);
				var canv = can.getContext("2d");
				canv.drawImage(x, 0, 0);
				var data = canv.getImageData(0, 0, x.width, x.height);
				for (var i = 0; i < data.data.length; i += 4) {
					if (data.data[i] + data.data[i + 1] + data.data[i + 2] < 111) {
						data.data[i + 3] = 0;
					}
				}
				canv.putImageData(data, 0, 0);
				var dataURL = can.toDataURL();
				x.src = dataURL;
				can.parentNode.removeChild(can);

			};
			this.loop(_noBlack);
			return _Ω;
		},

		//fix for arrays?

		static:  function () {
			var _static = function (x) {
				var can = document.createElement("canvas");
				can.height = x.height;
				can.width = x.width;
				can.id = x.id + "_can";
				can.style.cssText = x.style.cssText;
				x.parentNode.appendChild(can);
				var canv = can.getContext("2d");
				canv.drawImage(x, 0, 0);
				var data = canv.getImageData(0, 0, x.width, x.height);
				var y = 0;
				var crazify = function () {
					x.style.display = "none";
					if (y > 30) {
						window.clearInterval(interval);
						var dataURL = can.toDataURL();
						x.src = dataURL;
						x.style.display = "";
						can.parentNode.removeChild(can);
						return _Ω;
					} else {
						canv.putImageData(data, 0, 0);
						for (var i = 0; i < data.data.length; i += 4) {
							data.data[i] = data.data[i] + Math.ceil(Math.random() * 200 - 100);
							data.data[i + 1] = data.data[i + 1] + Math.ceil(Math.random() * 200 - 100);
							data.data[i + 2] = data.data[i + 2] + Math.ceil(Math.random() * 200 - 100);
						}
					}
				};
				crazify();
				var interval = window.setInterval(function () {
					y++;
					return crazify();
				}, 50);
			};
			this.loop(_static);
			return _Ω;
		},

		// make a selector function for each undefined html element
		shortcuts: function () {
			var htmlTags = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"];
			for (var i = 0; i < htmlTags.length; i++) {
				if (!window[htmlTags[i]]) {
					(function (i) {
						window[htmlTags[i]] = function () {
							return Ω(htmlTags[i]);
						};
					})(i);
				}
			}
			return _Ω;
		}
	};

	window.Ω = Ω;

})(window, document);