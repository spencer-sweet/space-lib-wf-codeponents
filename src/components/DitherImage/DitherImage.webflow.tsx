import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import { DitherImage } from "./DitherImage";

export default declareComponent(DitherImage, {
  name: "DitherImage",
  description: "Render an image with Floyd-Steinberg dithering in WebGL.",
  group: "Media",
  props: {
    src: props.Text({
      name: "Image URL",
      defaultValue:
        "https://www.languageline.com/hs-fs/hubfs/sinai.jpg?width=2135&name=sinai.jpg"
    }),
    dither: props.Number({
      name: "Dither",
      defaultValue: 97
    }),
    backgroundColor: props.Text({
      name: "Background color",
      defaultValue: "#000000"
    }),
    width: props.Number({
      name: "Processing width",
      defaultValue: 800
    })
  }
});
