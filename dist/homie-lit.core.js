var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __legacyMetadataTS = (k, v) => {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};

// src/HomieDevice.ts
class HomieDevice {
  constructor(id, name = id, type = "") {
    this.id = id;
    this.name = name;
    this.type = type;
    this.nodes = new Map;
  }
  addNode(node) {
    this.nodes.set(node.id, node);
  }
  removeNode(node) {
    this.nodes.delete(node.id);
  }
  getNode(id) {
    return this.nodes.get(id);
  }
  getAllNodes() {
    return Array.from(this.nodes.values());
  }
}

// src/HomieDeviceElement.ts
import { LitElement, html as html2, css } from "lit";
import { customElement, property } from "lit/decorators.js";

// src/HomieNodeComponent.ts
import { html, render } from "lit";

// src/PropertyBindingManager.ts
class PropertyBindingManager {
  constructor(observer) {
    this.observer = observer;
    this.bindings = new Map;
    this.transformers = new Map;
    if (this.observer) {
      this.setupSubscription();
    }
    this.registerDefaultTransformers();
  }
  registerDefaultTransformers() {
    this.registerTransformer("json", (val) => {
      try {
        return typeof val === "string" ? JSON.parse(val) : val;
      } catch (e) {
        return val;
      }
    });
  }
  registerTransformer(name, transformer) {
    this.transformers.set(name, transformer);
  }
  getTransformer(name) {
    return this.transformers.get(name);
  }
  setupSubscription() {
    if (this.observer) {
      this.observer.updated$.subscribe((event) => {
        if (event.type === "property") {
          const path = `${event.device.id}/${event.node.id}/${event.property.id}`;
          this.updateBindingsForPath(path, event.property.value);
        }
      });
    }
  }
  bindPath(path, element, attribute, transformer) {
    let pathBindings = this.bindings.get(path);
    if (!pathBindings) {
      pathBindings = [];
      this.bindings.set(path, pathBindings);
    }
    let transformerFn;
    if (typeof transformer === "string") {
      transformerFn = this.getTransformer(transformer);
    } else {
      transformerFn = transformer;
    }
    pathBindings.push({ element, attribute, transformer: transformerFn });
  }
  updateBindingsForPath(path, value) {
    const pathBindings = this.bindings.get(path);
    if (pathBindings) {
      pathBindings.forEach(({ element, attribute, transformer }) => {
        let finalValue = value;
        if (transformer) {
          try {
            finalValue = transformer(value);
          } catch (e) {
            console.error(`Error applying transformer for path ${path}:`, e);
          }
        }
        if (typeof finalValue === "object") {
          element.setAttribute(attribute, finalValue);
        } else {
          element.setAttribute(attribute, finalValue.toString());
        }
      });
    }
  }
}

// src/HomieNodeComponent.ts
class HomieNodeComponent extends HTMLElement {
  constructor(node) {
    super();
    this.node = node;
    this.bindingManager = new PropertyBindingManager;
  }
  connectedCallback() {
    this.render();
  }
  render() {
    const template = html`
      <div class="homie-node">
        <h2>${this.node.name}</h2>
        ${this.node.getAllProperties().map((prop) => html`
          <div class="property">
            <span>${prop.name}: </span>
            <span>${prop.getValue()}</span>
          </div>
        `)}
      </div>
    `;
    render(template, this);
    this.node.getAllProperties().forEach((prop) => {
      const element = this.querySelector(`.property`);
      if (element instanceof HTMLElement) {
        this.bindingManager.bindPath(prop.id, element, "data-value");
      }
    });
  }
}
customElements.define("homie-node", HomieNodeComponent);

// src/HomieDeviceElement.ts
class HomieDeviceElement extends LitElement {
  constructor() {
    super(...arguments);
  }
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }
  `;
  render() {
    return html2`
      <div class="homie-device">
        ${this.device?.getAllNodes().map((node) => html2`
          <homie-node .node=${node}></homie-node>
        `)}
      </div>
    `;
  }
}
__legacyDecorateClassTS([
  property({ type: Object }),
  __legacyMetadataTS("design:type", typeof HomieDevice === "undefined" ? Object : HomieDevice)
], HomieDeviceElement.prototype, "device", undefined);
HomieDeviceElement = __legacyDecorateClassTS([
  customElement("homie-device"),
  __legacyMetadataTS("design:paramtypes", [])
], HomieDeviceElement);

// src/HomieNode.ts
class HomieNode {
  constructor(id, name = id, type = "") {
    this.id = id;
    this.name = name;
    this.type = type;
    this.properties = new Map;
  }
  addProperty(property) {
    this.properties.set(property.id, property);
  }
  getProperty(id) {
    return this.properties.get(id);
  }
  getAllProperties() {
    return Array.from(this.properties.values());
  }
}

// src/HomieProperty.ts
class HomieProperty {
  constructor(id, name = id, value, dataType, format = "") {
    this.id = id;
    this.name = name;
    this.value = value;
    this.dataType = dataType;
    this.format = format;
  }
  setValue(newValue) {
    this.value = newValue;
  }
  getValue() {
    return this.value;
  }
}

// src/HomieObserver.ts
import { Subject } from "rxjs";
import mqtt from "mqtt";

// src/logger.ts
import log from "loglevel";
log.setLevel(log.levels.INFO);
var logger = log.getLogger("homie-lit");
logger.setLevel("info");
var setLogLevel = (level) => {
  logger.setLevel(level);
};
var logger_default = logger;

// src/HomieObserver.ts
class MqttClient {
  constructor(brokerUrl, options = {}, messageCallback, onConnectCallback, onDisconnectCallback) {
    this.client = mqtt.connect(brokerUrl);
    this.homiePrefix = options.homiePrefix || "homie";
    this.messageCallback = messageCallback;
    this.onConnectCallback = onConnectCallback;
    this.onDisconnectCallback = onDisconnectCallback;
    this.client.on("connect", () => {
      logger_default.info("Connected to MQTT broker");
      this.onConnectCallback();
    });
    this.client.on("close", () => {
      logger_default.info("Disconnected from MQTT broker");
      this.onDisconnectCallback();
    });
    this.client.on("message", (topic, message) => this.handleMessage(topic, message));
  }
  subscribe(pattern) {
    const subscriptionTopic = this.getSubscriptionTopic(pattern);
    logger_default.debug(`Subscribing to topic: ${subscriptionTopic}`);
    this.client.subscribe(subscriptionTopic);
  }
  publish(topic, message, options = {}) {
    const fullTopic = `${this.homiePrefix}/${topic}`;
    logger_default.debug(`Publishing to topic: ${fullTopic}`);
    this.client.publish(fullTopic, message, options);
  }
  getSubscriptionTopic(pattern) {
    return pattern.startsWith(this.homiePrefix) ? pattern : `${this.homiePrefix}/${pattern}`;
  }
  handleMessage(topic, message) {
    logger_default.debug(`Received message on topic: ${topic}`);
    const topicParts = topic.split("/");
    if (topicParts[0] !== this.homiePrefix || topicParts.length < 3)
      return;
    const [, deviceId, nodeId, propertyId] = topicParts;
    const value = message.toString();
    if (nodeId === "$state") {
      this.handleDeviceState(deviceId, value);
    } else if (propertyId === undefined) {
      this.handleNodeState(deviceId, nodeId, value);
    } else {
      this.handlePropertyState(deviceId, nodeId, propertyId, value);
    }
  }
  handleDeviceState(deviceId, state) {
    const device = { id: deviceId, nodes: {} };
    const event = { type: "device" /* Device */, device };
    this.messageCallback(event);
  }
  handleNodeState(deviceId, nodeId, state) {
    const device = { id: deviceId, nodes: {} };
    const node = { id: nodeId, properties: {} };
    const event = { type: "node" /* Node */, device, node };
    this.messageCallback(event);
  }
  handlePropertyState(deviceId, nodeId, propertyId, value) {
    const device = { id: deviceId, nodes: {} };
    const node = { id: nodeId, properties: {} };
    const property = { id: propertyId, value };
    const event = { type: "property" /* Property */, device, node, property };
    this.messageCallback(event);
  }
  disconnect() {
    if (this.client && !this.client.disconnected) {
      this.client.end();
    }
  }
}

class HomieObserver {
  constructor(messageHandler) {
    this.messageHandler = messageHandler;
    this.devices = {};
    this.onCreate = new Subject;
    this.onUpdate = new Subject;
    this.onDelete = new Subject;
    this.onConnect = new Subject;
    this.onDisconnect = new Subject;
    logger_default.debug("HomieObserver constructor called");
  }
  subscribe(topic) {
    this.messageHandler.subscribe(topic);
  }
  publish(topic, message, options = {}) {
    this.messageHandler.publish(topic, message, options);
  }
  get created$() {
    return this.onCreate.asObservable();
  }
  get updated$() {
    return this.onUpdate.asObservable();
  }
  get deleted$() {
    return this.onDelete.asObservable();
  }
  get connected$() {
    return this.onConnect.asObservable();
  }
  get disconnected$() {
    return this.onDisconnect.asObservable();
  }
  onConnectEvent() {
    this.onConnect.next();
  }
  onDisconnectEvent() {
    this.onDisconnect.next();
  }
  processEvent(event) {
    logger_default.debug("HomieObserver processing event:", event);
    switch (event.type) {
      case "device" /* Device */:
        this.processDeviceEvent(event);
        break;
      case "node" /* Node */:
        this.processNodeEvent(event);
        break;
      case "property" /* Property */:
        this.processPropertyEvent(event);
        break;
    }
  }
  processDeviceEvent(event) {
    const { device } = event;
    if (!this.devices[device.id]) {
      this.devices[device.id] = device;
      this.onCreate.next(event);
    } else {
      this.onUpdate.next(event);
    }
  }
  processNodeEvent(event) {
    const { device, node } = event;
    if (!this.devices[device.id]) {
      this.devices[device.id] = device;
      this.onCreate.next({ type: "device" /* Device */, device });
    }
    if (!this.devices[device.id].nodes[node.id]) {
      this.devices[device.id].nodes[node.id] = node;
      this.onCreate.next(event);
    } else {
      this.onUpdate.next(event);
    }
  }
  processPropertyEvent(event) {
    logger_default.debug("Processing property event", { event });
    const { device, node, property } = event;
    if (!this.devices[device.id]) {
      this.devices[device.id] = device;
      this.onCreate.next({ type: "device" /* Device */, device });
      logger_default.debug("Emitted create event for device", { deviceId: device.id });
    }
    if (!this.devices[device.id].nodes[node.id]) {
      this.devices[device.id].nodes[node.id] = node;
      this.onCreate.next({ type: "node" /* Node */, device, node });
      logger_default.debug("Emitted create event for node", { deviceId: device.id, nodeId: node.id });
    }
    const existingProperty = this.devices[device.id].nodes[node.id].properties[property.id];
    if (!existingProperty) {
      this.devices[device.id].nodes[node.id].properties[property.id] = property;
      this.onCreate.next(event);
      logger_default.debug("Emitted create event for new property", { deviceId: device.id, nodeId: node.id, propertyId: property.id });
    } else if (existingProperty.value !== property.value) {
      this.devices[device.id].nodes[node.id].properties[property.id] = property;
      this.onUpdate.next(event);
      logger_default.debug("Emitted update event for property", { deviceId: device.id, nodeId: node.id, propertyId: property.id });
    }
  }
}
function createMqttHomieObserver(brokerUrl, options = {}) {
  let observer;
  const mqttClient = new MqttClient(brokerUrl, options, (event) => {
    if (observer) {
      observer.processEvent(event);
    }
  }, () => {
    if (observer) {
      observer.onConnectEvent();
    }
  }, () => {
    if (observer) {
      observer.onDisconnectEvent();
    }
  });
  observer = new HomieObserver(mqttClient);
  return observer;
}

// src/HomiePropertyBuffer.ts
import { Subject as Subject2, merge } from "rxjs";
import { bufferTime, filter, map, tap, share } from "rxjs/operators";
class HomiePropertyBuffer {
  constructor(homieObserver, bufferTimeMs = 100) {
    this.homieObserver = homieObserver;
    this.bufferTimeMs = bufferTimeMs;
    this.propertyUpdates$ = new Subject2;
    this.propertyGroups = [];
    logger_default.info("HomiePropertyBuffer constructor called");
    this.setupPropertyUpdateStream();
    this.bufferedUpdates$ = this.setupBufferedUpdatesStream();
  }
  addPropertyGroup(group) {
    this.propertyGroups.push(group);
  }
  getPropertyPriority(nodeId, propertyId) {
    const group = this.propertyGroups.find((g) => g.properties.includes(`${nodeId}/${propertyId}`));
    return group ? group.priority : 0;
  }
  setupPropertyUpdateStream() {
    logger_default.info("Setting up property update stream");
    merge(this.homieObserver.created$, this.homieObserver.updated$).pipe(tap((event) => logger_default.debug("Received event in setupPropertyUpdateStream", { event })), filter((event) => event.type === "property" /* Property */), map((event) => {
      if (event.type === "property" /* Property */) {
        logger_default.debug("Processing property event", { event });
        const update = {
          deviceId: event.device.id,
          nodeId: event.node.id,
          propertyId: event.property.id,
          value: event.property.value,
          priority: this.getPropertyPriority(event.node.id, event.property.id)
        };
        logger_default.debug("Created BufferedPropertyUpdate", { update });
        return update;
      }
      throw new Error("Unexpected event type");
    }), tap((update) => {
      logger_default.debug("Emitting update to propertyUpdates$", { update });
      this.propertyUpdates$.next(update);
    })).subscribe({
      next: () => logger_default.debug("Subscription in setupPropertyUpdateStream emitted a value"),
      error: (err) => logger_default.error("Error in setupPropertyUpdateStream", { error: err }),
      complete: () => logger_default.info("Subscription in setupPropertyUpdateStream completed")
    });
  }
  setupBufferedUpdatesStream() {
    logger_default.info("Setting up buffered updates stream");
    return this.propertyUpdates$.pipe(tap(() => logger_default.debug("propertyUpdates$ emitted a value")), bufferTime(this.bufferTimeMs), tap((updates) => logger_default.debug("Buffered updates", { updates })), filter((updates) => updates.length > 0), map((updates) => {
      const sortedUpdates = updates.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        const groupA = this.propertyGroups.find((g) => g.properties.includes(`${a.nodeId}/${a.propertyId}`));
        const groupB = this.propertyGroups.find((g) => g.properties.includes(`${b.nodeId}/${b.propertyId}`));
        if (groupA && groupB && groupA === groupB) {
          return groupA.properties.indexOf(`${a.nodeId}/${a.propertyId}`) - groupB.properties.indexOf(`${b.nodeId}/${b.propertyId}`);
        }
        return 0;
      });
      logger_default.debug("Sorted updates", { updates });
      return updates;
    }), share());
  }
  getBufferedUpdates() {
    logger_default.info("Getting buffered updates");
    return this.bufferedUpdates$;
  }
  processBufferedUpdates(processor) {
    logger_default.info("Setting up buffered updates processor");
    this.getBufferedUpdates().subscribe({
      next: (updates) => {
        logger_default.debug("Processing buffered updates", { updates });
        processor(updates);
      },
      error: (err) => logger_default.error("Error in processBufferedUpdates", { error: err }),
      complete: () => logger_default.info("processBufferedUpdates subscription completed")
    });
  }
}
// src/index.ts
var HomieLit = {
  HomieDevice,
  HomieDeviceElement,
  HomieNode,
  HomieNodeComponent,
  HomieProperty,
  HomiePropertyBuffer,
  PropertyBindingManager,
  HomieObserver,
  createMqttHomieObserver,
  logger: logger_default,
  setLogLevel
};
var src_default = HomieLit;
export {
  HomieDevice,
  HomieDeviceElement,
  HomieNode,
  HomieNodeComponent,
  HomieObserver,
  HomieProperty,
  HomiePropertyBuffer,
  PropertyBindingManager,
  createMqttHomieObserver,
  src_default as default,
  logger_default as logger,
  setLogLevel
};

//# debugId=F1BCE2EB0DA340BA64756E2164756E21
