type Node<T> = { item?: T; rest: Stack<T> };

class Stack<T> {
  private item?: T;
  private rest?: Stack<T>;
  private length?: number;

  get isEmpty() {
    return this.item === undefined;
  }

  get size() {
    return this.length ?? 0;
  }

  push(item: T) {
    const stack = new Stack<T>();

    stack.item = item;
    stack.rest = this;
    stack.length = this.length === undefined ? 1 : this.length + 1;

    return stack;
  }

  pushAll(items: T[]) {
    return items.reduce<Stack<T>>((acc, item) => acc.push(item), this);
  }

  pop() {
    return { item: this.item, rest: this.rest ?? this } as Node<T>;
  }

  traverse() {
    const items = [] as T[];

    let element = this as Stack<T> | undefined;

    while (element?.item !== undefined) {
      items.push(element.item);

      element = element.rest;
    }

    return items;
  }
}

export { Stack };
