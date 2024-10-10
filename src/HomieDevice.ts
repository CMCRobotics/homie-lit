import { HomieNode } from './HomieNode';

export class HomieDevice {
  private nodes: Map<string, HomieNode> = new Map();

  constructor(public id: string, public name: string = id, public type: string = '') { }

  addNode(node: HomieNode) {
    this.nodes.set(node.id, node);
  }

  removeNode(node: HomieNode){
    this.nodes.delete(node.id);
  }

  getNode(id: string): HomieNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): HomieNode[] {
    return Array.from(this.nodes.values());
  }
}