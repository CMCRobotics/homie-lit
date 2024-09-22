import { HomieProperty } from './HomieProperty';

export class PropertyBindingManager {
  private bindings: Map<string, HTMLElement> = new Map();

  bindProperty(property: HomieProperty, element: HTMLElement, attribute: string) {
    const key = `${property.name}-${attribute}`;
    this.bindings.set(key, element);
    this.updateElement(property, element, attribute);

    // TODO: Implement property change listener
  }

  private updateElement(property: HomieProperty, element: HTMLElement, attribute: string) {
    element.setAttribute(attribute, property.getValue().toString());
  }
}