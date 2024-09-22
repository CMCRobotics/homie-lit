import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomieDevice } from './HomieDevice';
import './HomieNodeComponent';

@customElement('homie-device')
export class HomieDeviceElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
  `;

  @property({ type: Object })
  device!: HomieDevice;

  render() {
    return html`
      <div class="homie-device">
        <h1>${this.device.name}</h1>
        ${this.device.getAllNodes().map(node => html`
          <homie-node .node=${node}></homie-node>
        `)}
      </div>
    `;
  }
}