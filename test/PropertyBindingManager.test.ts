import { PropertyBindingManager } from '../src/PropertyBindingManager';
import { HomieObserver, HomieEventType, HomieEvent } from '../src/HomieObserver';
import { Subject } from 'rxjs';

describe('PropertyBindingManager', () => {
  let bindingManager: PropertyBindingManager;
  let mockObserver: any;
  let updatedSubject: Subject<HomieEvent>;

  beforeEach(() => {
    updatedSubject = new Subject<HomieEvent>();
    mockObserver = {
      updated$: updatedSubject.asObservable(),
    } as unknown as HomieObserver;

    bindingManager = new PropertyBindingManager(mockObserver);
  });

  test('should bind a path to an element attribute and update when event is received', () => {
    const attributes: Record<string, string> = {};
    const mockElement = { setAttribute: (key: string, val: string) => { attributes[key] = val; } } as unknown as HTMLElement;
    bindingManager.bindPath('device1/node1/prop1', mockElement, 'data-value');

    // Simulate an event
    updatedSubject.next({
      type: HomieEventType.Property,
      device: { id: 'device1', nodes: {} },
      node: { id: 'node1', properties: {} },
      property: { id: 'prop1', value: 'hello' }
    } as any);

    expect(attributes['data-value']).toBe('hello');
  });

  test('should use a default transformer (json)', () => {
    const attributes: Record<string, any> = {};
    const mockElement = { setAttribute: (key: string, val: any) => { attributes[key] = val; } } as unknown as HTMLElement;
    bindingManager.bindPath('device1/node1/prop2', mockElement, 'data-parsed', 'json');

    // Simulate an event with JSON
    updatedSubject.next({
      type: HomieEventType.Property,
      device: { id: 'device1', nodes: {} },
      node: { id: 'node1', properties: {} },
      property: { id: 'prop2', value: '{"x": 10, "y": 20}' }
    } as any);

    expect(attributes['data-parsed']).toEqual({ x: 10, y: 20 });
  });

  test('should allow registering and using custom transformers', () => {
    const attributes: Record<string, string> = {};
    const mockElement = { setAttribute: (key: string, val: string) => { attributes[key] = val; } } as unknown as HTMLElement;
    
    // Register custom transformer
    bindingManager.registerTransformer('uppercase', (val: any) => typeof val === 'string' ? val.toUpperCase() : val);

    bindingManager.bindPath('device1/node1/prop3', mockElement, 'data-upper', 'uppercase');

    updatedSubject.next({
      type: HomieEventType.Property,
      device: { id: 'device1', nodes: {} },
      node: { id: 'node1', properties: {} },
      property: { id: 'prop3', value: 'test string' }
    } as any);

    expect(attributes['data-upper']).toBe('TEST STRING');
  });

  test('should handle transformer functions passed directly', () => {
    const attributes: Record<string, string> = {};
    const mockElement = { setAttribute: (key: string, val: string) => { attributes[key] = val; } } as unknown as HTMLElement;

    bindingManager.bindPath('device1/node1/prop4', mockElement, 'data-direct', (val: string) => val + '-suffix');

    updatedSubject.next({
      type: HomieEventType.Property,
      device: { id: 'device1', nodes: {} },
      node: { id: 'node1', properties: {} },
      property: { id: 'prop4', value: 'base' }
    } as any);

    expect(attributes['data-direct']).toBe('base-suffix');
  });

  test('should safely handle errors in transformers', () => {
    const attributes: Record<string, string> = {};
    const mockElement = { setAttribute: (key: string, val: string) => { attributes[key] = val; } } as unknown as HTMLElement;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    bindingManager.registerTransformer('faulty', () => { throw new Error('transformer error'); });
    bindingManager.bindPath('device1/node1/prop5', mockElement, 'data-faulty', 'faulty');

    updatedSubject.next({
      type: HomieEventType.Property,
      device: { id: 'device1', nodes: {} },
      node: { id: 'node1', properties: {} },
      property: { id: 'prop5', value: 'test' }
    } as any);

    expect(attributes['data-faulty']).toBe('test');
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
