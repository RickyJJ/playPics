import { SingletonList } from "./SingletonList";
import { ISingletonElement } from "../../resource/ISingletonElement"

/**
 * <code>SimpleSingletonList</code> 类用于实现单例队列。
 */
export class SimpleSingletonList extends SingletonList<ISingletonElement> {
	/**
	 * 创建一个新的 <code>SimpleSingletonList</code> 实例。
	 */
	constructor() {
		super();

	}

	/**
	 * @internal
	 */
	add(element: ISingletonElement): void {
		var index: number = element._getIndexInList();
		if (index !== -1)
			throw "SimpleSingletonList:" + element + " has  in  SingletonList.";
		this._add(element);
		element._setIndexInList(this.length++);
	}

	/**
	 * @internal
	 */
	remove(element: ISingletonElement): void {
		var index: number = element._getIndexInList();
		this.length--;
		if (index !== this.length) {
			var end: any = this.elements[this.length];
			this.elements[index] = end;
			end._setIndexInList(index);
		}
		element._setIndexInList(-1);
	}

}


