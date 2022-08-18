import React, { useCallback, useEffect, useRef, useState } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';
import { Comments } from './sandbox';

function App1() {
  const [fc, setRef] = useCanvas(canvas => {
    // do stuff with canvas after initialization
    const group = new fabric.Layer(
      [
        new fabric.Triangle({
          top: 300,
          left: 210,
          width: 100,
          height: 100,
          fill: "blue",
        }),
        new fabric.IText(
          "I am a text object inside a layer. \nTry selecting and transforming me and my siblings",
          {
            fontSize: 16,
            width: 150,
            top: 80,
            left: 230,
          }
        ),
        new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "green" })
      ],
      {
        fill: 'red',
        opacity: 0.9,
        clipPath: new fabric.Circle({ radius: 150, fill: "green", originX: 'center', originY: 'center' })
      }
    );
    canvas.add(
      group,
      new fabric.Triangle({
        top: 300,
        left: 50,
        width: 100,
        height: 100,
        fill: "orange"
      })
    );
    group.on('selected', opt => {
      console.log(opt);
    })
    canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
    canvas.isDrawingMode = true;
    canvas.on('path:created', () => {
      canvas.isDrawingMode = false;
    })
  });

  return (
    <>
      <Comments>
        {/**add comments explaning what this is all about */}
      </Comments>
      <canvas
        width={500}
        height={500}
        ref={setRef}
      />
    </>
  );
}

//export default App1;



const JSON_DATA = [];

export default function App() {
  const [action, setAction] = useState(0);
  const [erasable, setErasable] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [inverted, setInverted] = useState(false);
  const ref = useRef<fabric.Canvas>(null);
  const i = useRef<number>(2);

  const load = useCallback(() => {
    const canvas = ref.current!;
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
    const canvas = new fabric.Canvas("c", {
      overlayColor: overlay ? "rgba(0,0,255,0.4)" : undefined
    });
    canvas.on("selection:created", async (e) => { });
    canvas.on("selection:updated", (e) => {
      //console.log(e.target.eraser);
    });

    //canvas.setViewportTransform([1,0,0,1,50,0])

    var clipPath = new fabric.Circle({
      radius:200,
      originX:'center',
      originY:'center',
        
    });

    var clipPath2 = new fabric.Circle({
      radius: 100,
      top: 150,
      left: 200,
      absolutePositioned: true


    });

    const nestedGroup = new fabric.Group([
      new fabric.Circle({
        top: 140, left: 200, radius: 75, fill: "green",

      })
    ], {
      clipPath: new fabric.Circle({
        radius: 25,
        left: -50,
        originX: 'center',
        originY: 'center',

        inverted: true
      })
    });
    const group = new fabric.Group(
      [
        new fabric.Triangle({
          top: 300,
          left: 210,
          width: 100,
          height: 100,
          fill: "blue",
          erasable: false
        }),
        new fabric.IText(
          "This group will loose an object once selected, erasable = true",
          {
            fontSize: 16,
            width: 150,
            top: 80,
            left: 230,
            erasable: false
          }
        ),
        //new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "red", erasable: false }),
        nestedGroup
        
      ],
      {
        erasable: 'deep',
        clipPath
      }
    );
    

    const groupB = new fabric.Group(
      [
        new fabric.Triangle({
          top: 300,
          left: 210,
          width: 100,
          height: 100,
          fill: "blue",
          erasable: false
        }),
        new fabric.Textbox(
          "This group will ungroup once selected, erasable = deep",
          {
            fontSize: 16,
            width: 150,
            top: 80,
            left: 230,
            erasable: false
          }
        ),
        new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "red", erasable: false }),
        new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "green" }),
      ],
      {
        erasable: true,
        left: 10
      }
    );

    nestedGroup.on("selected", async (e) => {
      const g = e.target as fabric.Group;
      const obj = g._objects[0];
      g.removeWithUpdate(obj);
      g.clipPath = undefined;
      g.dirty = true;
      canvas.add(obj);
      canvas.renderAll();
    });

    //  test group change
    group.on("selected", async (e) => {
      const g = e.target as fabric.Group;
      const obj = g._objects[0];
      g.removeWithUpdate(obj);
      g.clipPath = undefined;
      canvas.add(obj);
      if (g.size() === 0) {
        canvas.discardActiveObject();
        canvas.remove(g);
        setTimeout(() => {
          canvas.setActiveObject(obj);
        }, 50);
        
      }
      canvas.renderAll();
    });

    //  test ungrouping
    groupB.on("selected", async (e) => {
      const g = e.target as fabric.Group;
      g.destroy();
      canvas.remove(g);
      canvas.add(...g._objects);
      canvas.setActiveObject(g._objects[g._objects.length - 1]);
      canvas.renderAll();
    });

    canvas.add(
      new fabric.Rect({
        top: 50,
        left: 100,
        width: 50,
        height: 50,
        fill: "#f55",
        opacity: 0.8
      }),
      new fabric.Rect({
        top: 50,
        left: 150,
        width: 50,
        height: 50,
        fill: "#f55",
        opacity: 0.8
      }),
      new fabric.Circle({ top: 0, left: 0, radius: 75, fill: "red", erasable: false, opacity: 0.3 }),
      group,
      groupB,
      new fabric.Circle({
        top: 0, left: 0, radius: 75, fill: "yellow", 
        clipPath: new fabric.Rect({
        //  top: 50,
       //   left: 150,
          //inverted:true,
          originX:'center',originY:'center',
          width: 50,
          height: 50,
          clipPath: new fabric.Circle({ top: 0, left: 0, radius: 10, originX: 'center', originY: 'center', }),
        }),
      }),
      
    );

    fabric.Image.fromURL(
      "https://ip.webmasterapi.com/api/imageproxy/http://fabricjs.com/assets/mononoke.jpg",
      function (img) {
        // img.set("erasable", false);

        img.clone((img) => {
          canvas.add(
            img
              .set({
                left: 400,
                top: 350,
                clipPath: new fabric.Circle({
                  radius: 200,
                  originX: "center",
                  originY: "center"
                }),
                angle: 30
              })
              .scale(0.25)
          );
          img.on("selected", () => {
            img.setClipPath(
              new fabric.Circle({
                radius: img.getClipPath().radius + 5,
                originX: "center",
                originY: "center"
              })
            );
            canvas.renderAll();
          });
          canvas.renderAll();
        });

        img.set({ opacity: 0.7 });
        function animate() {
          img.animate("opacity", img.get("opacity") === 0.7 ? 0.4 : 0.7, {
            duration: 1000,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: animate
          });
        }
        animate();
        canvas.setBackgroundImage(img);
        img.set({ erasable });
        canvas.on("erasing:end", ({ targets, drawables }) => {
          console.log(
            "objects:",
            targets.map((t) => t.type),
            "drawables:",
            Object.keys(drawables)
          );
          targets.map((t) => t.eraser);
        });
        canvas.renderAll();
      }
      //{ crossOrigin: "anonymous" }
    );

    function animate() {
      try {
        canvas
          .item(0)
          .animate("top", canvas.item(0).get("top") === 500 ? "100" : "500", {
            duration: 1000,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: animate
          });
      } catch (error) {
        setTimeout(animate, 500);
      }
    }
    animate();
    ref.current = canvas;
  }, []);

  useEffect(() => {
    const fc = ref.current!;
    switch (action) {
      case 0:
        fc.isDrawingMode = false;
        break;
      case 1:
        fc.freeDrawingBrush = new fabric.EraserBrush(fc);
        /*
        fc.freeDrawingBrush.shadow = new fabric.Shadow({
          blur: 5,
          offsetX: 0,
          offsetY: 0,
          affectStroke: true,
          color: "black"
        });*/
        fc.freeDrawingBrush.width = 10;
        fc.freeDrawingBrush.inverted = inverted;
        fc.isDrawingMode = true;
        break;
      case 2:
        fc.freeDrawingBrush = new fabric.SprayBrush(fc);
        fc.freeDrawingBrush.width = 35;
        fc.isDrawingMode = true;
        break;
      default:
        break;
    }
  }, [action]);

  useEffect(() => {
    const d = ref.current!.get("backgroundImage");
    d?.set({ erasable });
  }, [erasable]);

  useEffect(() => {
    const canvas = ref.current!;
    canvas.overlayColor = overlay ? 'rgba(0,0,255,0.4)' : undefined;
    canvas.requestRenderAll();
  }, [overlay]);

  useEffect(() => {
    const canvas = ref.current!;
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
          <label htmlFor="rr">inverted erasing</label>
          <input
            id="rr"
            type="checkbox"
            onChange={(e) => setInverted(e.currentTarget.checked)}
            checked={inverted}
          />
        </div>
      </div>
      <div>
        <button
          onClick={async () => {
            const json = ref.current!.toDatalessJSON(["clipPath"]);
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
            const canvas = ref.current!;
            const bg = canvas.backgroundImage;
            canvas.setBackgroundImage(null);
            const image = canvas.getObjects("image")[0];
            canvas.remove(image);
            const base64 = canvas.toDataURL({
              format: ext,
              enableRetinaScaling: true
            });
            canvas.setBackgroundImage(bg);
            canvas.add(image);
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
            const svg = ref.current!.toSVG();
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
          onClick={() => {
            fabric.loadSVGFromURL(svg2, (result) => {
              console.log(result);
              ref.current?.clear();
              const canvas = ref.current!;
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
      <canvas id="c" width={500} height={500} />
    </div>
  );
}
