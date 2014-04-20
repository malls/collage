var Ω = function(selector){
	if( selector === undefined ){
		return window;
	}else{
		return Ω.up(selector);
	}
};

Ω.__proto__ = Ω.prototype = {

	//initialze empty object and dom sector
	obj: null,

	up: function(selector){
		if(selector === undefined){
			return window;
		}else{
			var args = Array.prototype.slice.call(arguments);
			var letters = args[0].split('');
			if( letters[0] === "." ){
				letters.splice(0,1);
				selector = letters.join('');
				me = document.getElementsByClassName(selector);
			}else if( letters[0] === "#" ){
				letters.splice(0,1);
				selector = letters.join('');
				me = document.getElementById(selector);
			}else if( selector === document ){
				return document;
			}else if( selector === 'body' ){
				me = document.getElementsByTagName('body')[0];
			}else if( selector === 'html' ){
				me = document.getElementsByTagName('html')[0];
			}else{
				me = document.getElementsByTagName(selector);
			}
		}
		return Ω;
	},

	//event listeners

	on: function(type, fn){
		me['on' + type] = function(){
			fn();
		};
	},

	click: function(fn){
		me.onclick = function(){
			fn();
		};
		return Ω;
	},

	mouseover: function(fn){
		me.onmouseover = function(){
			fn();
		};
		return Ω;
	},

	drag: function(fn){
		me.ondrag = function(){
			fn();
		};
		return Ω;
	},

	dragover: function(fn){
		me.ondragover = function(){
			fn();
		};
		return Ω;
	},

	//functions

	setBackground: function(url, options){
		if(me instanceof Array){
			for(var i = 0; i < input.length; i++){
				me[i].style.background = "url('" + url + "') " + options;
				console.log(me[i].style.background);
			}
		} else {
			me.style.background = "url('" + url + "') " + options;
		}
		return Ω;
	},
	
	draggable: function(){
		me.draggable = true;
		me.style.position = "absolute";
		me.ondrag = function(e){
			var xpos = e.x - 15;
			var ypos = e.y - 15;
			me.style.left = Math.ceil(xpos) + "px";
			me.style.top = Math.ceil(ypos) + "px";
			me.ondragover = function(e){
				e.preventDefault();
			};
		};
		return Ω;
	},

	eachDo: function(fn){
		for( var i = 0; i < me.length; i++ ){
			fn(me[i]);
		}
		return Ω;
	},

	hide: function(){
		if( me[0] === undefined){
			me.style.display = "none";
		}else{
			for( var i = 0; i < me.length; i++ ){
				me[i].style.display = "none";
			}
		}
		return Ω;
	},

	show: function(){
		if( me[0] === undefined){
			me.style.display = "";
		}else{
			for( var i = 0; i < me.length; i++ ){
			me[i].style.display = "";
			}
		}
		return Ω;
	},

	toggleDisplay: function(){
		if( me[0] === undefined){
			if( me.style.display != "none" ){
				me.style.display = "none";
				return Ω;
			}else{
				me.style.display = "";
				return Ω;
			}
		}else{
			for( var i = 0; i < me.length; i++ ){
				if( me[i].style.display != "none" ){

					me[i].style.display = "none";
				}else{
					me[i].style.display = "";
				}
			}
		}
		return Ω;
	},

//doesn't work?
	itsClass: function(x){
		if(x === undefined){
			return me.className;
		} else {
			me.className = me.className + " " + x;
			return Ω;
		}
	},

	noClass: function(){
		me.className = "";
		return Ω;
	},

	destroy: function(){
		me.parentNode.removeChild(me);
		return Ω;
	},

	thisObj: function(){
		return me;
	},

	//make each
	duplicate: function(){
		var me2 = document.createElement(me.nodeName);
		me2.prototype = me.prototype;
		me2.style = me.style;
		me2.src = me.src;
		me2.class = me.class;
		me2.style = me.style;
		me2.id = me.id + "_dupe";
		me.parentNode.appendChild(me2);
		me = me2;
		return Ω;
	},

	mirror: function(){
		if (
			me.style.transform != "scaleX(-1)" &&
	    me.style.mozTransform != "scaleX(-1)" &&
	    me.style.oTransform != "scaleX(-1)" &&
	    me.style.webkitTransform != "scaleX(-1)" &&
	    me.style.transform != "scaleX(-1)" &&
	    me.style.filter != "FlipH" &&
	    me.style.msFilter != "FlipH"
	   ){
			me.style.transform = "scaleX(-1)" 
	    me.style.mozTransform = "scaleX(-1)";
	    me.style.oTransform = "scaleX(-1)";
	    me.style.webkitTransform = "scaleX(-1)";
	    me.style.transform = "scaleX(-1)";
	    me.style.filter = "FlipH";
	    me.style.msFilter = "FlipH";
	  } else{
	  	me.style.transform = 
	    me.style.mozTransform = 
	    me.style.oTransform = 
	    me.style.webkitTransform = 
	    me.style.transform = 
	    me.style.filter = 
	    me.style.msFilter = "";
	  }
	  return Ω;
	},

	//make each
	noWhite:  function(){
		me.crossOrigin = 'anonymous';
		var can = document.createElement("canvas");
		can.height = me.height;
		can.width = me.width;
		can.id = me.id + "_nobg";
		can.style.cssText = me.style.cssText;
		me.parentNode.appendChild(can);
		canv = can.getContext("2d");

    canv.drawImage( me, 0, 0 );
    var data = canv.getImageData( 0, 0, me.width, me.height );

    for ( var i = 0; i < data.data.length; i += 4 ){
    	if( data.data[i] + data.data[ i + 1 ] + data.data[ i + 2 ] > 720 ){
    		data.data[ i + 3 ] = 0;
    	} else if ( data.data[i] + data.data[ i + 1 ] + data.data[ i + 2 ] > 550 ){
    		data.data[ i + 3 ] = 200;
    	}
    }
    canv.putImageData(data, 0, 0);
		var dataURL = can.toDataURL();
    me.src = dataURL;
    can.parentNode.removeChild(can);
    return Ω;
	},

  noBlack:  function(){
		me.crossOrigin = 'anonymous';
		var can = document.createElement("canvas");
		can.height = me.height;
		can.width = me.width;
		can.id = me.id + "_nobg";
		can.style.cssText = me.style.cssText;
		me.parentNode.appendChild(can);
		canv = can.getContext("2d");

    canv.drawImage( me, 0, 0 );
    var data = canv.getImageData( 0, 0, me.width, me.height );

    for ( var i = 0; i < data.data.length; i += 4 ){
    	if( data.data[i] + data.data[ i + 1 ] + data.data[ i + 2 ] < 111 ){
    		data.data[ i + 3 ] = 0;
    	}
    }

    canv.putImageData(data, 0, 0);
		var dataURL = can.toDataURL();
    me.src = dataURL;
    can.parentNode.removeChild(can);
    return Ω;
	},

  static:  function(){
		me.crossOrigin = 'anonymous';
		var can;
		if(!document.getElementById(me.id + '_can')){
			can = document.createElement("canvas");
			can.height = me.height;
			can.width = me.width;
			can.id = me.id + "_can";
			can.style.cssText = me.style.cssText;
			me.parentNode.appendChild(can);
		} else {
			can = document.getElementById(me.id + "_can");
		}
		canv = can.getContext("2d");
    canv.drawImage( me, 0, 0 );
    var data = canv.getImageData( 0, 0, me.width, me.height );
    console.log(me.width,"width");
    console.log(me.height,"height");
    console.log(data.data.length,"number of pixels");
		var y = 0;
		var crazify = function(){
			Ω.hide();
    	if( y > 30 ){
    		window.clearInterval(interval);
				var dataURL = can.toDataURL();
				me.src = dataURL;
				Ω.show();
				can.parentNode.removeChild(can);
				return Ω;
    	} else {
      	canv.putImageData(data, 0, 0);
	      for ( var i = 0; i < data.data.length; i += 4 ){
	      	data.data[ i ] = data.data[i] + Math.ceil( Math.random() * 200 - 100);
	      	data.data[ i + 1 ] = data.data[ i + 1 ] + Math.ceil( Math.random() * 200 - 100 );
	      	data.data[ i + 2 ] = data.data[ i + 2 ] + Math.ceil( Math.random() * 200 - 100 );
	      }
    	}
  	};
  	crazify();
    var interval = window.setInterval(function(){y++; return crazify();}, 50);
	},

};

var me = Ω.prototype.obj;

//to do: update selection without using array prototype, come up with each method and apply to extant methods