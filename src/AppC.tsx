import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';
import { Comments } from './sandbox';

function App() {
  const [fc, setRef] = useCanvas(canvas => {
    // do stuff with canvas after initialization

    //canvas.backgroundColor = 'red'

    var clipPath = new fabric.Circle({
      radius: 50,
      top: -50,
      left:-100,
      //absolutePositioned:true
    });

    var group = new fabric.Group([
      new fabric.Rect({ width: 100, height: 100, fill: 'red', selectable: false }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100, selectable: true }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100, selectable: false }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100, selectable: false })
    ], { originX: 'left', originY: 'top' });
    group.clipPath = clipPath;

    var shadow = new fabric.Shadow({
      color: 'red',
      blur: 5,
      offsetX: 10,
      offsetY: 10
    });

    // Create a new Text instance
    var text = new fabric.Text('Text Shadow Test', {
      shadow: shadow
    });

    var rect = new fabric.Rect({
      width: 100, height: 100, fill: 'green', left: 10, top: 10,
      clipPath: new fabric.Circle({
        radius: 25,
        //top: -10,
        //left: 10,
        //absolutePositioned:true
      })
    });

    //group.add(text);

    canvas.add(group, rect);

    canvas.renderAll();

  });


  return (
    <>
      <Comments>
        {/**add comments explaning what this is all about */}
        {/*<a href="https://github.com/fabricjs/fabric.js/issues/7454">#7454 <code>Group With ClipPath and Text with Shadow Renders Incorrectly</code></a>*/}
        The objects are clipped, their clip path not centered.
        Try seleting the objects.
      </Comments>
      <canvas
        width={500}
        height={500}
        ref={setRef}
      />
    </>
  );
}

export default App;