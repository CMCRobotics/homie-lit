import { HomieProperty } from './HomieProperty';

export class HomieNode {
  private properties: Map<string, HomieProperty> = new Map();

  constructor(public name: string) {}

  addProperty(property: HomieProperty) {
    this.properties.set(property.name, property);
  }

  getProperty(name: string): HomieProperty | undefined {
    return this.properties.get(name);
  }

  getAllProperties(): HomieProperty[] {
    return Array.from(this.properties.values());
  }
}