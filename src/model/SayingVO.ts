import { Point } from "laya/maths/Point";
import { Handler } from "laya/utils/Handler";
import { Tween } from "laya/utils/Tween";

export default class SayingVO {
    readonly text: string;

    public point: Point

    readonly picPath: string

    readonly isTogglePic: boolean

    constructor(text: string, point: Point = null, picPath: string = null, isTogglePic: boolean = false, textEffect: Function = null) {
        this.text = text
        this.point = point
        this.picPath = picPath
        this.isTogglePic = isTogglePic
    }

    public static say(text: string, point: Point = null, picPath: string = null, isTogglePic: boolean = false, textEffect: Function = null) {
        return new SayingVO(text, point, picPath, isTogglePic, textEffect)
    } 
}