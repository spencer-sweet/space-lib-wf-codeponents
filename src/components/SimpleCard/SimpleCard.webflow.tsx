import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";
import { SimpleCard } from "./SimpleCard";

export default declareComponent(SimpleCard, {
  name: "SimpleCard",
  description: "A simple starter card component.",
  group: "Basics",
  props: {
    title: props.Text({
      name: "Title",
      defaultValue: "Hello from React"
    }),
    body: props.Text({
      name: "Body",
      defaultValue: "This is your first component."
    })
  }
});
