import { PropType, PropValues, props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import { DitherImage } from "./DitherImage";

type DitherImageWebflowProps = {
  image?: PropValues[PropType.Image];
  src?: string;
  dither?: number;
  backgroundColor?: string;
  width?: number;
};

function DitherImageWebflowComponent({
  image,
  src,
  dither,
  backgroundColor,
  width
}: DitherImageWebflowProps) {
  return (
    <DitherImage
      image={image}
      src={src}
      dither={dither}
      backgroundColor={backgroundColor}
      width={width}
    />
  );
}

export default declareComponent(DitherImageWebflowComponent, {
  name: "DitherImage",
  description: "Render the input image with a bitmap effect in a HTML Canvas",
  group: "Media",
  props: {
    image: props.Image({
      name: "Image"
    }),
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
