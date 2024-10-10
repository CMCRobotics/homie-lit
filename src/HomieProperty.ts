export class HomieProperty {
  constructor(public id: string, public name: string = id, public value: any, public dataType: any) {}

  setValue(newValue: any) {
    this.value = newValue;
  }

  getValue(): any {
    return this.value;
  }
}