import { Component } from 'vue';
import ButtonRender from './ButtonRender';

export interface Button {
  type?: string;
  label?: string;
  icon?: Component;
  action?: () => void;
  children?: Array<Button>;
  group?: Array<Button>;
}

export interface ButtonRenderProps {
  buttons: Array<Button>;
  buttonClick?: (btn: Button) => void;
}
export default ButtonRender;
