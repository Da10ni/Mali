// components/Login.stories.tsx
import React from "react";
import { linkTo } from "@storybook/addon-links"; // Correct import for linking between stories
import Login from "./page"; // Assuming Login is the Login component

export default {
  title: "login/page", // This is correct
  component: Login,
};

const Template = (args) => <Login {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithRegisterLink = () => (
  <div>
    <Login />
  </div>
);
