import { HomieObserver } from './HomieObserver';

export type Transformer = (value: any) => any;

export class PropertyBindingManager {
  private bindings: Map<string, Array<{ element: HTMLElement; attribute: string; transformer?: Transformer }>> = new Map();
  private transformers: Map<string, Transformer> = new Map();

  constructor(private observer: HomieObserver) {
    this.setupSubscription();
    this.registerDefaultTransformers();
  }

  private registerDefaultTransformers() {
    this.registerTransformer('json', (val) => {
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch (e) {
        return val;
      }
    });
  }

  registerTransformer(name: string, transformer: Transformer) {
    this.transformers.set(name, transformer);
  }

  getTransformer(name: string): Transformer | undefined {
    return this.transformers.get(name);
  }

  private setupSubscription() {
    this.observer.updated$.subscribe((event) => {
      if (event.type === 'property') {
        const path = `${event.device.id}/${event.node.id}/${event.property.id}`;
        this.updateBindingsForPath(path, event.property.value);
      }
    });
  }

  bindPath(path: string, element: HTMLElement, attribute: string, transformer?: Transformer | string) {
    let pathBindings = this.bindings.get(path);
    if (!pathBindings) {
      pathBindings = [];
      this.bindings.set(path, pathBindings);
    }

    let transformerFn: Transformer | undefined;
    if (typeof transformer === 'string') {
      transformerFn = this.getTransformer(transformer);
    } else {
      transformerFn = transformer;
    }

    pathBindings.push({ element, attribute, transformer: transformerFn });
  }

  private updateBindingsForPath(path: string, value: any) {
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
        
        if (typeof finalValue === 'object') {
          // If it's an object (like A-Frame position), we might need to stringify or keep as is
          // A-Frame's setAttribute handles objects for some components.
          element.setAttribute(attribute, finalValue);
        } else {
          element.setAttribute(attribute, finalValue.toString());
        }
      });
    }
  }
}
