//@ts-nocheck
import React from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';

function App() {
  const [fc, setRef] = useCanvas(canvas => {
    const circle = new fabric.Circle({ left: 100, top: 50, radius: 50 });
    const text = new fabric.IText('', { evented: true });
    const g = new fabric.Group([
      new fabric.Rect({
        top: 200,
        width: 50,
        height: 50,
        fill: 'red'
      }),
      circle
    ]);
    canvas.add(

      text,
      g
    );
    canvas.renderAll();
    text.set('text', `circle is on screen? ${circle.isOnScreen()}`);
    canvas.renderAll();
    g.on('modified', () => {
      text.set('text', `circle is on screen? ${circle.isOnScreen()}`)
      canvas.requestRenderAll();
    });
    /*
    let t=null;
    g.on('mousedown', () => {
      t &&clearTimeout(t);
    });
    g.on('mouseup', () => {
      t = setTimeout(() => {
        const target = circle;
        target.setCoords();
        canvas.setActiveObject(target);
        canvas.requestRenderAll();
      }, 1000);
    });
    */
  });

  return (
    <div className="App">
      <canvas ref={setRef} width={500} height={500} />
    </div>
  );
}


export default App;
