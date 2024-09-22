import { HomieNode } from './HomieNode';

export class HomieDevice {
  private nodes: Map<string, HomieNode> = new Map();

  constructor(public name: string) {}

  addNode(node: HomieNode) {
    this.nodes.set(node.name, node);
  }

  getNode(name: string): HomieNode | undefined {
    return this.nodes.get(name);
  }

  getAllNodes(): HomieNode[] {
    return Array.from(this.nodes.values());
  }
}