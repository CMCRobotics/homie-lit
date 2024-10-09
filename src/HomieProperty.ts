export class HomieProperty {
  constructor(public name: string, public value: any, public dataType: any) {}

  setValue(newValue: any) {
    this.value = newValue;
    // TODO: Implement update logic and event emission
  }

  getValue(): any {
    return this.value;
  }
}