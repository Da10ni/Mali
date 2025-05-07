// components/Login.stories.tsx
import React from "react";
// import { linkTo } from "@storybook/addon-links"; // Correct import for linking between stories
import Aboutus from "./page"; // Assuming Login is the Login component

export default {
  title: "aboutus/page", // This is correct
  component: Aboutus,
};

const Template = (args) => <Aboutus {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithRegisterLink = () => (
  <div>
    <Aboutus />
  </div>
);
