import React, { useCallback, useEffect, useRef, useState } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';
import { Comments } from './sandbox';

const JSON_DATA = [];

export default function App() {
  const [action, setAction] = useState(0);
  const [erasable, setErasable] = useState(false);
  const [overlay, setOverlay] = useState(true);
  const [inverted, setInverted] = useState(false);
  const i = useRef<number>(2);

  const [fc, setRef] = useCanvas(canvas => {
    // do stuff with canvas after initialization
    canvas.add(
      new fabric.Circle({
        top: 100, left: 100, radius: 75, fill: "red",
        clipPath: new fabric.Rect({
          //  top: 50,
          //   left: 150,
          originX: 'center', originY: 'center',
          width: 50,
          height: 50,
          clipPath: new fabric.Circle({ top: 0, left: 0, radius: 10, originX: 'center', originY: 'center', }),
        }),
      }),
      new fabric.Group([
        new fabric.Circle({
          top: 0, left: 0, radius: 75, fill: "red",
          clipPath: new fabric.Group([
            new fabric.Circle({
              top: 0, left: 0, radius: 100, fill: "red"
            })
          ], {
            clipPath: new fabric.Circle({
              top: -50, left: -50, radius: 25, fill: "red",
              originX: 'center',
              originY: 'center',
            })
          })
        })
      ])
    );
  });

  const load = useCallback(() => {
    const canvas = fc.current!;
    canvas.loadFromJSON(
      JSON_DATA[i.current % 3],
      () => {
      },
      function (o, object) {
        fabric.log(o, object);
        /*
         */
      }
    );
    i.current = i.current + 1;
  }, []);

  useEffect(() => {
    const canvas = fc.current!;
    switch (action) {
      case 0:
        canvas.isDrawingMode = false;
        break;
      case 1:
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        /*
        fc.freeDrawingBrush.shadow = new fabric.Shadow({
          blur: 5,
          offsetX: 0,
          offsetY: 0,
          affectStroke: true,
          color: "black"
        });*/
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.inverted = inverted;
        canvas.isDrawingMode = true;
        break;
      case 2:
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
        canvas.freeDrawingBrush.width = 35;
        canvas.isDrawingMode = true;
        break;
      default:
        break;
    }
  }, [action]);

  useEffect(() => {
    const d = fc.current!.get("backgroundImage");
    d?.set({ erasable });
  }, [erasable]);

  useEffect(() => {
    const canvas = fc.current!;
    canvas.overlayColor = overlay ? 'rgba(0,0,255,0.4)' : undefined;
    canvas.requestRenderAll();
  }, [overlay]);

  useEffect(() => {
    const canvas = fc.current!;
    canvas.freeDrawingBrush && (canvas.freeDrawingBrush.inverted = inverted);
  }, [inverted]);

  const getTitle = useCallback((action) => {
    switch (action % 3) {
      case 0:
        return "select";
      case 1:
        return "erase";
      case 2:
        return "spray";
      default:
        return "";
    }
  }, []);

  return (
    <div className="App">
      <div>
        {[1, 2, 3].map((action) => (
          <button key={`action${action}`} onClick={() => setAction(action % 3)}>
            {getTitle(action)}
          </button>
        ))}
      </div>
      <div>
        <div>
          <label htmlFor="a">
            background image <code>erasable</code>
          </label>
          <input
            id="a"
            type="checkbox"
            onChange={(e) => setErasable(e.currentTarget.checked)}
            checked={erasable}
          />
        </div>
        <div>
          <label htmlFor="b">
            overlay color
          </label>
          <input
            id="b"
            type="checkbox"
            onChange={(e) => setOverlay(e.currentTarget.checked)}
            checked={overlay}
          />
        </div>
        <div>
          <label htmlFor="b">inverted erasing</label>
          <input
            id="b"
            type="checkbox"
            onChange={(e) => setInverted(e.currentTarget.checked)}
            checked={inverted}
          />
        </div>
      </div>
      <div>
        <button
          onClick={async () => {
            const json = fc.current!.toDatalessJSON(["clipPath"]);
            const out = JSON.stringify(json, null, "\t");
            console.log(out);
            const blob = new Blob([out], { type: "text/plain" });
            const clipboardItemData = { [blob.type]: blob };
            try {
              navigator.clipboard &&
                (await navigator.clipboard.write([
                  new ClipboardItem(clipboardItemData)
                ]));
            } catch (error) {
              console.log(error);
            }
            /*
              try {
              assert.deepEqual(out, data);
            } catch (error) {
              console.error(error);
            }
            */
          }}
        >
          toJSON
        </button>
        <button onClick={load}>from JSON</button>
        <button
          onClick={() => {
            const ext = "png";
            const canvas = fc.current!;
            const bg = canvas.backgroundImage;
            canvas.setBackgroundImage(null);
            const image = canvas.getObjects("image")[0];
            canvas.remove(image);
            const base64 = canvas.toDataURL({
              format: ext,
              enableRetinaScaling: true
            });
            canvas.setBackgroundImage(bg);
            image && canvas.add(image);
            const link = document.createElement("a");
            link.href = base64;
            link.download = `eraser_example.${ext}`;
            link.click();
          }}
        >
          to Image
        </button>
        <button
          onClick={() => {
            const svg = fc.current!.toSVG();
            const a = document.createElement("a");
            const blob = new Blob([svg], { type: "image/svg+xml" });
            const blobURL = URL.createObjectURL(blob);
            a.href = blobURL;
            a.download = "eraser_example.svg";
            a.click();
            URL.revokeObjectURL(blobURL);
          }}
        >
          toSVG
        </button>
        <button
          disabled
          onClick={() => {
            fabric.loadSVGFromURL(require('./svg.svg').default, (result) => {
              console.log(result);
              fc.current?.clear();
              const canvas = fc.current!;
              const bg = result.shift();
              const overlay = result.pop();
              canvas.setBackgroundImage(bg, null, { erasable });
              canvas.setOverlayColor(overlay, null, { erasable: overlay });
              canvas.add(...result);
            });
          }}
        >
          from SVG
        </button>
      </div>
      <Comments>
        {/**add comments explaning what this is all about */}
        Compare what you see on canvas to svg and image outputs<br/>
        SVG output doesn't support nested clip path on group<br />
        Downloading might not work on codesandbox...
      </Comments>
      <canvas
        width={500}
        height={500}
        ref={setRef}
      />
    </div>
  );
}
