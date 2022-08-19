//@ts-nocheck
import React, { useEffect, useState } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';

function App() {
  const [fc, setRef] = useCanvas(canvas => {
    // do stuff with canvas after initialization
    var points = [/*
      {
        x: 3,
        y: 4
      },
      {
        x: 16,
        y: 3
      },
      {
        x: 26,
        y: 5
      },
      {
        x: 25,
        y: 200
      },
      {
        x: 19,
        y: 44
      },
      {
        x: 15,
        y: 30
      },
      {
        x: 15,
        y: 55
      },
      {
        x: 9,
        y: 55
      },
      {
        x: 6,
        y: 53
      },*/
      {
        x: 0,
        y: 10
      },
      {
        x: 100,
        y: 15
      },
      {
        x: 105,
        y: 20
      },
      {
        x: 120,
        y: 30
      },
      {
        x: 20,
        y: 20
      },
      {
        x: 20,
        y: 80
      },
    ];
    const options = {
      left: 100,
      top: 50,
      fill: "#D81B60",
      strokeWidth: 4,
      stroke: "green",
      scaleX: 4,
      scaleY: 4,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: "blue",
      strokeLineJoin: "miter",
    //  strokeLineCap: "round",
      strokeUniform: false,
      strokeMiterLimit: 10,
      originX: 'left',
      originY: 'top'
    }
    const triangle = new fabric.Triangle({
      top: 300,
      left: 50,
      width: 20,
      height: 100,
      fill: "orange",
      strokeWidth: 5,
      stroke: 'black',
      strokeLineJoin: "bevel",
      strokeMiterLimit: 4
    })
    canvas.add(
      new fabric.Polygon(points, options),
      new fabric.Polyline(points,{ ...options, left:0,fill:'' }),
      triangle,
      // group,

    );
/*
    canvas.forEachObject(obj => {
      obj.on('selected', () => {
        const ctx = canvas.contextTop as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, 5000, 5000);
        ctx.save();
        obj.transform(ctx);
        points.forEach(p => {
          ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
        });
        ctx.restore()
      })
    })
*/
  });

  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeLineJoin, setStrokeLineJoin] = useState('miter');
  const [strokeMiterLimit, setStrokeMiterLimit] = useState(4);

  useEffect(() => {

    fc.current?.forEachObject(obj => {
      obj.set({ strokeWidth, strokeLineJoin, strokeMiterLimit, dirty: true });
      const center = obj.getCenterPoint();
      obj._setPositionDimensions && obj._setPositionDimensions(obj);
      obj.setCoords();
      obj.setPositionByOrigin(center, 'center', 'center');
    });
    fc.current?.requestRenderAll();

  }, [strokeWidth, strokeLineJoin, strokeMiterLimit]);

  return (
    <>
      <form>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          strokeWidth
          <input type="range" min={1} max={10} value={strokeWidth} onChange={e => setStrokeWidth(Number(e.currentTarget.value))} />
          strokeMiterLimit
        <input type="range" min={0} max={50} value={strokeMiterLimit} onChange={e => setStrokeMiterLimit(Number(e.currentTarget.value))} />
        <select onChange={e => setStrokeLineJoin(e.currentTarget.value)} value={strokeLineJoin}>
          {['bevel', 'miter', 'round'].map(mlj => <option key={mlj} value={mlj}>{mlj}</option>)}
        </select>
        </div>
      </form>
      <canvas
        width={500}
        height={500}
        ref={setRef}
      />
    </>
  );
}

export default App;
