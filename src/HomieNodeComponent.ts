import { html, render } from 'lit';
import { HomieNode } from './HomieNode';
import { PropertyBindingManager } from './PropertyBindingManager';

export class HomieNodeComponent extends HTMLElement {
  private node: HomieNode;
  private bindingManager: PropertyBindingManager;

  constructor(node: HomieNode) {
    super();
    this.node = node;
    this.bindingManager = new PropertyBindingManager();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const template = html`
      <div class="homie-node">
        <h2>${this.node.name}</h2>
        ${this.node.getAllProperties().map(prop => html`
          <div class="property">
            <span>${prop.name}: </span>
            <span>${prop.getValue()}</span>
          </div>
        `)}
      </div>
    `;
    render(template, this);

    // Bind properties to attributes
    this.node.getAllProperties().forEach(prop => {
      const element = this.querySelector(`.property:has(span:contains('${prop.name}'))`);
      if (element instanceof HTMLElement) {
        this.bindingManager.bindProperty(prop, element, 'data-value');
      }
    });
  }
}

customElements.define('homie-node', HomieNodeComponent);