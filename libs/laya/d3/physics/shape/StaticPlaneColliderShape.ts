import { ColliderShape } from "./ColliderShape";
import { Vector3 } from "../../math/Vector3"
import { Physics3D } from "../Physics3D";

/**
 * <code>StaticPlaneColliderShape</code> 类用于创建静态平面碰撞器。
 */
export class StaticPlaneColliderShape extends ColliderShape {
	private static _nativeNormal: any;
	/**@internal */
	_offset: number;
	/**@internal */
	_normal: Vector3;

	/**
	 * @internal
	 */
	static __init__(): void {
		StaticPlaneColliderShape._nativeNormal = new Physics3D._physics3D.btVector3(0, 0, 0);
	}

	/**
	 * 创建一个新的 <code>StaticPlaneColliderShape</code> 实例。
	 */
	constructor(normal: Vector3, offset: number) {
		super();
		this._normal = normal;
		this._offset = offset;
		this._type = ColliderShape.SHAPETYPES_STATICPLANE;

		StaticPlaneColliderShape._nativeNormal.setValue(-normal.x, normal.y, normal.z);
		this._nativeShape = new Physics3D._physics3D.btStaticPlaneShape(StaticPlaneColliderShape._nativeNormal, offset);
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	clone(): any {
		var dest: StaticPlaneColliderShape = new StaticPlaneColliderShape(this._normal, this._offset);
		this.cloneTo(dest);
		return dest;
	}

}


