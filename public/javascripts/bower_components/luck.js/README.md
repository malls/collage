#Ω.js

Ω (opt-z on mac, alt-234 on pc) is a dependency-free DOM and image manipulation library in the style of jQuery.

##Ready
Initialize the page by wrapping your JavaScript within the ready function to ensure it doesn't run until the DOM is loaded.

```
Ω('document').ready(function(){
  //all your js here
});

Ω().ready(function(){
  //you can also leave out 'document'
});
```

##Selection
Selection works like jQuery.

```
Ω('tag')
Ω(".class")
Ω('#id')
```

You can also use shorthand methods for the standard tag DOM selectors

```
div()
// is the same as 
Ω('div')
```

The DOM selectors allow the following:

##Methods

Methods are mostly chainable and work for both single elements and groups of elements. 

###.parent()
Switches selector to its parent node.

###.child(number)
Switch selector to its child nodes, or a specific child node if an integer argument is given.
```
<ol>
  <li>First Item</li>
  <li>Second Item</li>
</ol>

<script type="text/javascript">
  Ω('ol').child(2).hide();
</script>
//hides '<li>Second Item</li>'
```

###.setBackground(color, url, options)

The second two arguements are optional, but options depend on am image url.

```
Ω('body').setBackground('white', 'image.png', 'right top');
Ω('div').setBackground('#32c9dd');
```

###.draggable()

Make the element draggable. Uses absolute positioning.

###.hide() .show() .toggleDisplay()

Change display propteries.

###.itsClass('new class')

Adds new classes, or returns the class if a single element is selected and no argument is given.

```
Ω('img').itsClass('image');
Ω('#anImage').itsClass();
//returns 'image'
```
###.noClass()

Removes all classes

###.destroy()

Totally removes element from the DOM.

###.thisObj()

Returns the elements selected by Ω.

###.append([element])

Appends element to the selector.

###.duplicate()

Appends duplicates of the selected elements to the DOM with unique ID's.

###.mirror()

Flips stuff.

###.zup() .zdown()

Increment Z-index of an element up or down by one.

##Image Methods

###.noWhite()

Makes all white in an image transparent.

###.noBlack()

Makes all black in an image transparent.

###.static()

Randomly adjusts each opaque pixel's color in an image for a few seconds, then stops when the image is fully turned to static.

##Events
Events work like jQuery. For a list of supported events, see http://www.w3schools.com/tags/ref_eventattributes.asp

```
Ω(selector).on(event, function);
```

click, drag, dragover, and mouseover have shorthand methods, because I needed them for something. 

```
Ω('button').click(function(e){
  Ω('img').hide();
});
//sets all image display properties to "none"
```
To reference the DOM element calling the event, pass the event into a Ω selector.

```
Ω('img').on('mouseover', function(e){
  Ω(e).noWhite();
});
```

Methods set are added cumulatively.

```
Ω('img').click(function(e){
  Ω(e).mirror();
});

Ω('#someImageId').on('click', function(e){
  Ω('#someImageId').draggable();
});
//when clicked, the referenced image will be both mirrored and draggable.
```

No event delegation yet! Coming soon!