import { PropType, PropValues, props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import { ReactiveGridCard01 } from "./ReactiveGridCard01";

type ReactiveGridCard01WebflowProps = {
  eyebrowText?: string;
  title: string;
  description: string;
  cols?: number;
  rows?: number;
  highlightColor?: string;
  overlayImage?: PropValues[PropType.Image];
  overlayImageSrc?: string;
};

function ReactiveGridCard01WebflowComponent({
  eyebrowText,
  title,
  description,
  cols,
  rows,
  highlightColor,
  overlayImage,
  overlayImageSrc
}: ReactiveGridCard01WebflowProps) {
  return (
    <ReactiveGridCard01
      eyebrowText={eyebrowText}
      title={title}
      description={description}
      cols={cols}
      rows={rows}
      highlightColor={highlightColor}
      overlayImage={overlayImage}
      overlayImageSrc={overlayImageSrc}
    />
  );
}

export default declareComponent(ReactiveGridCard01WebflowComponent, {
  name: "ReactiveGridCard01",
  description: "Interactive card with reactive grid hover effect.",
  group: "Media",
  props: {
    eyebrowText: props.Text({
      name: "Eyebrow text",
      defaultValue: "1.3"
    }),
    title: props.Text({
      name: "Title",
      defaultValue: "Go to source"
    }),
    description: props.Text({
      name: "Description",
      defaultValue:
        "Hover around the grid to reveal highlights and motion from the center image."
    }),
    cols: props.Number({
      name: "X boxes",
      defaultValue: 32,
      min: 1,
      max: 80
    }),
    rows: props.Number({
      name: "Y boxes",
      defaultValue: 19,
      min: 1,
      max: 80
    }),
    highlightColor: props.Text({
      name: "Highlight color",
      defaultValue: "#88dc00"
    }),
    overlayImage: props.Image({
      name: "Overlay image"
    }),
    overlayImageSrc: props.Text({
      name: "Overlay image URL",
      defaultValue:
        "https://cdn.creazilla.com/cliparts/10000065703/olympic-rings-white-xl.png"
    })
  }
});
