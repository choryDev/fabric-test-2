import React, { useCallback, useEffect, useRef, useState } from 'react';
//  open `./fabric/fabric.ts` to change the import source (local build or published module)
import { fabric, useCanvas } from './fabric';
import { Comments } from './sandbox';

const Group = fabric.util.createClass(fabric.ICollection, {
  _set(key, value) {
    this.callSuper('_set', key, value);
    if (key === 'fill') {
      if (!this.bg && value) {
        this.bg = new fabric.Rect({
          evented: false,
          selectable:false,
          erasable: false,
          excludeFromExport: true,
          parent:this,
        });
      }
      if (value) {
        this.bg._set(key, value);
        if (!this.contains(this.bg)) {
          this.insertAt(this.bg, 0);
        }
      }
      else if (this.bg) {
        this.remove(this.bg);
      }
    }
  },
  getLayoutStrategyResult(a, o, c) {
    return this.callSuper('getLayoutStrategyResult', a, o.slice(1), c);
  },
  onLayout() {
    this.bg && this.bg
      .set({
        width: this.width,
        height: this.height
      })
      .setPositionByOrigin(this.getCenterPoint(), 'center', 'center');
  },
});

function App() {
  const [action, setAction] = useState(0);
  const [erasable, setErasable] = useState(false);
  const [erasable1, setErasable1] = useState(false);
  const [inverted, setInverted] = useState(false);
  const i = useRef<number>(2);

  const [fc, setRef] = useCanvas(canvas => {
    // do stuff with canvas after initialization
    canvas.overlayColor = "rgba(255,0,255,0.4)";
    canvas.selectionKey = 'ctrlKey';
    const group = new Group(
      [
        new fabric.Triangle({
          top: 300,
          left: 210,
          width: 100,
          height: 100,
          fill: "blue",
          erasable: false,
          shadow: new fabric.Shadow({ affectStroke: true, blur: 5, color: 'yellow', offsetX: 1, offsetY: 1 }),
          //clipPath: what
        }),
        new fabric.IText(
          "I am part of a selectable collection",
          {
            fontSize: 16,
            width: 150,
            top: 80,
            left: 230,
            erasable: false
          }
        ),
        new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "green" })
        //new fabric.ICollection([new fabric.Circle({ top: 140, left: 230, radius: 75, fill: "green" })])
      ],
      {
        fill: 'red',
        opacity: 0.7,
        //objectCaching: false,
        //
       // clipPath: new fabric.ICollection([new fabric.Circle({ radius: 200, originX: 'center', originY: 'center',})])
      }
    );

    const groupB = new fabric.ICollection(
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
            left: 10,
            erasable: false,
            opacity: 0.2
          }
        ),
        new fabric.Circle({ top: 0, left: 230, radius: 75, fill: "green" })
      ],
      {
        erasable: "deep",
        opacity: 0.7
      }
    );
    
    var url = 'data:image/svg+xml,%3csvg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="612px" height="502.174px" viewBox="0 65.326 612 502.174" enable-background="new 0 65.326 612 502.174" xml:space="preserve"%3e %3cellipse fill="%23C6C6C6" cx="283.5" cy="487.5" rx="259" ry="80"/%3e %3cpath id="bird" d="M210.333%2c65.331C104.367%2c66.105-12.349%2c150.637%2c1.056%2c276.449c4.303%2c40.393%2c18.533%2c63.704%2c52.171%2c79.03 c36.307%2c16.544%2c57.022%2c54.556%2c50.406%2c112.954c-9.935%2c4.88-17.405%2c11.031-19.132%2c20.015c7.531-0.17%2c14.943-0.312%2c22.59%2c4.341 c20.333%2c12.375%2c31.296%2c27.363%2c42.979%2c51.72c1.714%2c3.572%2c8.192%2c2.849%2c8.312-3.078c0.17-8.467-1.856-17.454-5.226-26.933 c-2.955-8.313%2c3.059-7.985%2c6.917-6.106c6.399%2c3.115%2c16.334%2c9.43%2c30.39%2c13.098c5.392%2c1.407%2c5.995-3.877%2c5.224-6.991 c-1.864-7.522-11.009-10.862-24.519-19.229c-4.82-2.984-0.927-9.736%2c5.168-8.351l20.234%2c2.415c3.359%2c0.763%2c4.555-6.114%2c0.882-7.875 c-14.198-6.804-28.897-10.098-53.864-7.799c-11.617-29.265-29.811-61.617-15.674-81.681c12.639-17.938%2c31.216-20.74%2c39.147%2c43.489 c-5.002%2c3.107-11.215%2c5.031-11.332%2c13.024c7.201-2.845%2c11.207-1.399%2c14.791%2c0c17.912%2c6.998%2c35.462%2c21.826%2c52.982%2c37.309 c3.739%2c3.303%2c8.413-1.718%2c6.991-6.034c-2.138-6.494-8.053-10.659-14.791-20.016c-3.239-4.495%2c5.03-7.045%2c10.886-6.876 c13.849%2c0.396%2c22.886%2c8.268%2c35.177%2c11.218c4.483%2c1.076%2c9.741-1.964%2c6.917-6.917c-3.472-6.085-13.015-9.124-19.18-13.413 c-4.357-3.029-3.025-7.132%2c2.697-6.602c3.905%2c0.361%2c8.478%2c2.271%2c13.908%2c1.767c9.946-0.925%2c7.717-7.169-0.883-9.566 c-19.036-5.304-39.891-6.311-61.665-5.225c-43.837-8.358-31.554-84.887%2c0-90.363c29.571-5.132%2c62.966-13.339%2c99.928-32.156 c32.668-5.429%2c64.835-12.446%2c92.939-33.85c48.106-14.469%2c111.903%2c16.113%2c204.241%2c149.695c3.926%2c5.681%2c15.819%2c9.94%2c9.524-6.351 c-15.893-41.125-68.176-93.328-92.13-132.085c-24.581-39.774-14.34-61.243-39.957-91.247 c-21.326-24.978-47.502-25.803-77.339-17.365c-23.461%2c6.634-39.234-7.117-52.98-31.273C318.42%2c87.525%2c265.838%2c64.927%2c210.333%2c65.331 z M445.731%2c203.01c6.12%2c0%2c11.112%2c4.919%2c11.112%2c11.038c0%2c6.119-4.994%2c11.111-11.112%2c11.111s-11.038-4.994-11.038-11.111 C434.693%2c207.929%2c439.613%2c203.01%2c445.731%2c203.01z"/%3e %3c/svg%3e';
    //fabric.ICollection.fromObject(url, c => console.log(c));
/*
    setTimeout(() => {
      fabric.ICollection.fromObject({ objects: url }, c => {
        canvas.add(c);
        console.log(c)
        canvas.setActiveObject(c)
      });
    }, 3000);
/*
    setTimeout(() => {
      group.add(groupB);
      canvas.requestRenderAll()
    }, 3000);

    setTimeout(() => {
      canvas.getActiveObject() === groupB || groupB.contains(canvas.getActiveObject(), true) && canvas.discardActiveObject();
      group.remove(groupB);
      canvas.requestRenderAll()
    }, 6000);


    /*
        //  test group change
        group.on("selected", async (e) => {
          const g = e.target as fabric.Layer;
          if (g._objects.length < 2) return;
          const obj = g._objects[0];
          g.remove(obj);
          canvas.add(obj);
          obj.clone((c) => {
            console.log(c.clipPath, c.getEraser());
          });
          canvas.renderAll();
        });
    
        //  test ungrouping
        groupB.on("selected", async (e) => {
          const g = e.target as fabric.Layer;
          canvas.remove(g);
          canvas.add(...g._objects);
          canvas.setActiveObject(g._objects[g._objects.length - 1]);
          g._objects.map((obj) =>
            obj.clone((c) => {
              console.log(c.clipPath, c.getEraser());
            })
          );
          canvas.renderAll();
        });
    */
    canvas.add(
      new fabric.Rect({
        top: 50,
        left: 100,
        width: 50,
        height: 50,
        fill: "#f55",
        opacity: 0.8,
        erasable:false
      }),
      group,
      new fabric.Triangle({
        top: 300,
        left: 210,
        width: 100,
        height: 100,
        fill: "blue",
        erasable: false,
        shadow: new fabric.Shadow({ affectStroke: true, blur: 5, color: 'yellow', offsetX: 1, offsetY: 1 }),
        //clipPath: what
      }),
      new fabric.Rect({
        top: 50,
        left: 150,
        width: 50,
        height: 50,
        fill: "#f55",
        opacity: 0.8,
        erasable: false
      }),
      //groupB
    );
    canvas.preserveObjectStacking = false;
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
       // animate();
        canvas.setBackgroundImage(img);
        img.set({ erasable });
        canvas.on("erasing:end", ({ targets, drawables }) => {
          console.log(
            "objects:",
            targets.map((t) => t.type),
            "drawables:",
            Object.keys(drawables)
          );
          targets.map((t) => t.getEraser());
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
  });

  const load = useCallback(() => {
    const canvas = fc.current!;
    canvas.loadFromJSON(
      JSON_DATA[i.current % 3],
      () => {
        canvas.renderAll();
        const d = canvas.get("backgroundImage");
        d?.set({ erasable });
        const d2 = canvas.get("overlayColor");
        d2?.set({ erasable: erasable1 });
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
        });
        */
        canvas.freeDrawingBrush.width = 10;
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
    const d = fc.current!.backgroundImage;
    d?.set({ erasable });
  }, [erasable]);

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
      <Comments>
        {/**add comments explaning what this is all about */}
        Use the spray brush to paint a really big spray with a lot of dots.
        Then try selecting different objects.
        When you select an ICollection some frames drop (see animation that freezes).
        What can be the reason? caching?
      </Comments>
      <div>
        {[1, 2, 3].map((action) => (
          <button key={`action${action}`} onClick={() => setAction(action % 3)}>
            {getTitle(action)}
          </button>
        ))}
        <button
          onClick={async () => {
            const active = fc.current?.getActiveObject();
            active?.set({ opacity: active.opacity === 1 ? Math.random() : 1 });
            fc.current?.requestRenderAll();
          }}
        >
          toggle opacity
        </button>
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
            overlay color <code>erasable</code>
          </label>
          <input
            id="b"
            type="checkbox"
            onChange={(e) => setErasable1(e.currentTarget.checked)}
            checked={erasable1}
          />
        </div>
        <div>
          <label htmlFor="b">inverted erasing</label>
          <input
            id="b"
            type="checkbox"
            onChange={(e) => setInverted(e.currentTarget.checked)}
            checked={erasable1}
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
          onClick={async () => {
            fabric.loadSVGFromURL((await import('./svg.svg')).default, (result) => {
             // console.log(result);
              fc.current?.clear();
              const canvas = fc.current!;
              const bg = result.shift();
              const overlay = result.pop();
              canvas.setBackgroundImage(bg, null, { erasable });
              canvas.setOverlayColor(overlay, null, { erasable: erasable1 });
              canvas.add(...result);
            });
          }}
        >
          from SVG
        </button>
      </div>
      <canvas ref={setRef} width={500} height={500} />
    </div>
  );
}


export default App;