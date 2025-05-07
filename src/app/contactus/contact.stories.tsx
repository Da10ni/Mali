// components/Login.stories.tsx
import React from "react";
import { linkTo } from "@storybook/addon-links"; // Correct import for linking between stories
import Contactus from "./page"; // Assuming Login is the Login component

export default {
  title: "contactus/page", // This is correct
  component: Contactus,
};

const Template = (args) => <Contactus {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithRegisterLink = () => (
  <div>
    <Contactus />
  </div>
);
