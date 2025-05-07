// components/Register.stories.tsx
import React from "react";
import { linkTo } from "@storybook/addon-links"; // Correct import for linking between stories
import Register from "./page"; // Assuming Register is the Register component

export default {
  title: "register/page", // This should be unique to avoid conflicts with Login
  component: Register,
};

const Template = (args) => <Register {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithLoginLink = () => (
  <div>
    <Register />
  </div>
);
