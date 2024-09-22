// lightBulb.js
import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
const { HomieDevice, HomieNode, HomieProperty, HomieDeviceElement } = HomieLit;

class LightBulbDevice extends HomieDevice {
    constructor(id, name) {
        super(id, name);
        this.addNode(new LightBulbNode('bulb', 'Light Bulb'));
    }
}

class LightBulbNode extends HomieNode {
    constructor(id, name) {
        super(id, name, 'light');
        this.addProperty(new LightBulbProperty('state', 'State', 'boolean'));
    }
}

class LightBulbProperty extends HomieProperty {
    constructor(id, name, datatype) {
        super(id, name, datatype);
        this.setValue(false); // Initially off
    }
}

class LightBulbDeviceElement extends HomieDeviceElement {
    static styles = css`
        .light-bulb-device {
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .bulb-emoji {
            font-size: 100px;
            cursor: pointer;
        }
    `;

    render() {
        if (this.device) {
            const bulbNode = this.device.getNode('bulb');
            const stateProperty = bulbNode.getProperty('state');
            const isOn = stateProperty.getValue();
            return html`
                <div class="light-bulb-device">
                    <h2>${this.device.name}</h2>
                    <div class="bulb-emoji">
                        ${isOn ? '🟡' : '⚪️'}
                    </div>
                    <p>State: ${isOn ? 'On' : 'Off'}</p>
                </div>
            `;
        }
        return html`<div>No device set</div>`;
    }

    _toggleState() {
        if (this.device) {
            const bulbNode = this.device.getNode('bulb');
            const stateProperty = bulbNode.getProperty('state');
            stateProperty.setValue(!stateProperty.getValue());
            this.requestUpdate();
        }
    }
}

class LightSwitchElement extends LitElement {
    static properties = {
        device: { type: Object }
    };

    static styles = css`
        :host {
            display: block;
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 20px;
        }
        .switch-emoji {
            font-size: 50px;
            cursor: pointer;
        }
    `;

    render() {
        if (this.device) {
            const bulbNode = this.device.getNode('bulb');
            const stateProperty = bulbNode.getProperty('state');
            const isOn = stateProperty.getValue();
            return html`
                <div class="light-switch">
                    <h3>Light Switch</h3>
                    <div class="switch-emoji" @click=${this._toggleState}>
                        ${isOn ? '👍' : '👎'}
                    </div>
                    <p>Switch is ${isOn ? 'On' : 'Off'}</p>
                </div>
            `;
        }
        return html`<div>No device set</div>`;
    }

    _toggleState() {
        if (this.device) {
            const bulbNode = this.device.getNode('bulb');
            const stateProperty = bulbNode.getProperty('state');
            stateProperty.setValue(!stateProperty.getValue());
            this.requestUpdate();
            
            // Dispatch an event to notify the parent component
            this.dispatchEvent(new CustomEvent('state-changed', {
                detail: { isOn: stateProperty.getValue() },
                bubbles: true,
                composed: true
            }));
        }
    }
}


customElements.define('light-bulb-device', LightBulbDeviceElement);
customElements.define('light-switch', LightSwitchElement);

export { LightBulbDevice, LightBulbDeviceElement, LightSwitchElement };