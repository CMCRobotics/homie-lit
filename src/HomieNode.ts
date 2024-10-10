import { HomieProperty } from './HomieProperty';

export class HomieNode {
  private properties: Map<string, HomieProperty> = new Map();

  constructor(public id: string, public name: string = id, public type: string = '') { }

  addProperty(property: HomieProperty) {
    this.properties.set(property.id, property);
  }

  getProperty(id: string): HomieProperty | undefined {
    return this.properties.get(id);
  }

  getAllProperties(): HomieProperty[] {
    return Array.from(this.properties.values());
  }
}