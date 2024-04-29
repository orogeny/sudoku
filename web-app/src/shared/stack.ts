type Node<T> = { item?: T; rest: Stack<T> };

class Stack<T> {
  private item?: T;
  private rest?: Stack<T>;

  get isEmpty() {
    return this.item === undefined;
  }

  push(item: T) {
    const stack = new Stack<T>();

    stack.item = item;
    stack.rest = this;

    return stack;
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
