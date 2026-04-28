import { useState } from "react";
import { SimpleCard } from "./components/SimpleCard/SimpleCard";
import { DitherImage } from "./components/DitherImage/DitherImage";
import { ReactiveGridCard01 } from "./components/ReactiveGridCard01/ReactiveGridCard01";

export default function App() {
  const [imageUrl, setImageUrl] = useState(
    "https://www.languageline.com/hs-fs/hubfs/sinai.jpg?width=2135&name=sinai.jpg"
  );
  const [dither, setDither] = useState(97);
  const [width, setWidth] = useState(550);
  const [backgroundColor, setBackgroundColor] = useState("#2445ff");
  const [xBoxes, setXBoxes] = useState(32);
  const [yBoxes, setYBoxes] = useState(19);

  return (
    <main className="app-shell">
      <h1>Webflow Code Components Starter</h1>
      <div className="component-examples">
        <details className="component-example" open>
          <summary className="component-example-summary">SimpleCard</summary>
          <div className="component-example-body">
            <SimpleCard title="Hello React" body="This is your first component." />
          </div>
        </details>

        <details className="component-example" open>
          <summary className="component-example-summary">DitherImage</summary>
          <div className="component-example-body">
            <div className="demo-controls">
              <label className="demo-field">
                <span>Image URL</span>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
              </label>

              <label className="demo-field">
                <span>Dither {dither}%</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={dither}
                  onChange={(event) => setDither(Number(event.target.value))}
                />
              </label>

              <div className="demo-row">
                <label className="demo-field">
                  <span>Width {width}px</span>
                  <input
                    type="range"
                    min={100}
                    max={1200}
                    value={width}
                    onChange={(event) => setWidth(Number(event.target.value))}
                  />
                </label>

                <label className="demo-field demo-color-field">
                  <span>BG color</span>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(event) => setBackgroundColor(event.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="dither-demo-frame">
              <DitherImage
                src={imageUrl}
                dither={dither}
                width={width}
                backgroundColor={backgroundColor}
              />
            </div>
          </div>
        </details>

        <details className="component-example" open>
          <summary className="component-example-summary">ReactiveGridCard01</summary>
          <div className="component-example-body">
            <div className="demo-row">
              <label className="demo-field">
                <span>X boxes {xBoxes}</span>
                <input
                  type="range"
                  min={1}
                  max={64}
                  value={xBoxes}
                  onChange={(event) => setXBoxes(Number(event.target.value))}
                />
              </label>
              <label className="demo-field">
                <span>Y boxes {yBoxes}</span>
                <input
                  type="range"
                  min={1}
                  max={48}
                  value={yBoxes}
                  onChange={(event) => setYBoxes(Number(event.target.value))}
                />
              </label>
            </div>

            <ReactiveGridCard01
              eyebrowText="1.3"
              overlayImageSrc="https://companieslogo.com/img/orig/ENE.defunct.2001_BIG.D-f2e9c1cf.png"
              title="Go to source"
              description="Hover around the grid to animate cells and the center image."
              cols={xBoxes}
              rows={yBoxes}
              highlightColor="grey"
            />
          </div>
        </details>
      </div>
    </main>
  );
}
