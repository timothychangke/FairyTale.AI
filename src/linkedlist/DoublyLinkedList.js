class DoublyLinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

    addItem(val) {
	let temp = new Node(val);
	if (this.head == null) {
		this.head = temp;
		this.tail = temp;
	} else {
		temp.prev = this.tail;
		this.tail.next = temp;
		this.tail = this.tail.next;
	}
}

}
