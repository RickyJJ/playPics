
import { Script } from "laya/components/Script";
import { Prefab } from "laya/components/Prefab";
import { Sprite } from "laya/display/Sprite";
import { Pool } from "laya/utils/Pool";
import { Laya } from "Laya";
import { Event } from "laya/events/Event";
import { Stage } from "laya/display/Stage";
/**
 * 游戏控制脚本。定义了几个dropBox，bullet，createBoxInterval等变量，能够在IDE显示及设置该变量
 * 更多类型定义，请参考官方文档
 */
export default class GameControl extends Script {
    /**开始时间*/
    private _time: number = 0;
    /**是否已经开始游戏 */
    private _started: boolean = false;
    /**子弹和盒子所在的容器对象 */
    private _gameBox: Sprite;

    constructor() { 
        super(); 

    }

    onEnable(): void {
        this._time = Date.now();
        this._gameBox = this.owner.getChildByName("gameBox") as Sprite;
    }

    onUpdate(): void {
        //每间隔一段时间创建一个盒子
    }

    onStageClick(e: Event): void {
    }

    /**开始游戏，通过激活本脚本方式开始游戏*/
    startGame(): void {
        if (!this._started) {
            this._started = true;
            this.enabled = true;
        }
    }

    /**结束游戏，通过非激活本脚本停止游戏 */
    stopGame(): void {
        this._started = false;
        this.enabled = false;
        this._gameBox.removeChildren();
    }
}