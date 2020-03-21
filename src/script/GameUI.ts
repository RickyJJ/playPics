import { ui } from "./../ui/layaMaxUI";
import GameControl from "./GameControl"
import { MouseManager } from "laya/events/MouseManager";
import { Event } from "laya/events/Event";
import { Laya } from "Laya";
import SayingVO from "../model/SayingVO";
import { Point } from "laya/maths/Point";
import { AudioSound } from "laya/media/h5audio/AudioSound";
import { SoundManager } from "laya/media/SoundManager";
import { Text } from "laya/display/Text";
import { Pool } from "laya/utils/Pool";
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
export default class GameUI extends ui.test.TestSceneUI {

    /**设置单例的引用方式，方便其他类引用 */
    static instance: GameUI;
    /**当前游戏积分字段 */
    private _score: number;
    /**游戏控制脚本引用，避免每次获取组件带来不必要的性能开销 */
    private _control: GameControl;

    /**
     * 记录已循环的次数
     */
    private loopCount: number = 0;

    /**
     * 是否开始循环，如果是，则在重复循环时将跳过开场白
     */
    private isStarted: boolean;

    private sayingIndex = 0;

    private paths: SayingVO[]

    private startSaying: SayingVO[]

    constructor() {
        super();
        Laya.stage.width = 1080
        Laya.stage.height = 1920
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE

        Laya.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        GameUI.instance = this;
        //关闭多点触控，否则就无敌了
        MouseManager.multiTouchEnabled = false;

        this.initStartSaying()
        this.initPicsPath()
        this.playMusic()
    }

    playMusic(): any {
        SoundManager.playMusic("sound/background.mp3", 0)
    }

    initStartSaying(): void {
        let self = this
        this.startSaying = []
        let say1 = new  Text();
        let say2 = new Text();
        let say3 = new Text(), say4 = new Text(), say5 = new Text();
        say1.text = "我要道歉";
        say2.text = "因为我"
        say3.text = "愚蠢", say4.text = "自私", say5.text = "冷落"
        say1.pos(150, 200)


        this.startSaying.push(SayingVO.say("首先我要说声对不起\n因为我这段时间", new Point(150, 200)))
     }

    initPicsPath(): void {
        this.paths = []
        this.paths.push(SayingVO.say("你知道我在等你么", new Point(50, 50), "test/stars.jpg", true))
        this.paths.push(SayingVO.say("我想和你在春天里漫步", new Point(100, 100), "test/spring.jpg", true))
        this.paths.push(SayingVO.say("我想和你在夏天里冲浪", new Point(50, 100), "test/summer.jpg", true))
        this.paths.push(SayingVO.say("我想和你在秋天去拾落叶", new Point(80, 90), "test/fall.jpg", true))
        this.paths.push(SayingVO.say("我想和你在冬天看雪景，堆雪人", new Point(60, 30), "test/winter.jpg", true))
        this.paths.push(SayingVO.say("那就是冬天最温暖的事了", new Point(60, 30), "test/winter2.jpeg", true))
        this.paths.push(SayingVO.say("能和我一起继续走下去么", new Point(70, 30), "test/parterner.jpg", true))
        this.paths.push(SayingVO.say("一起去远行吧！", new Point(50, 50), "test/road.jpg", true))
        this.paths.push(SayingVO.say("骑着自行车去", new Point(50, 50), "test/bike.jpg", true))
        this.paths.push(SayingVO.say("骑着自行车兜风阿！", new Point(50, 50), "test/bike2.jpeg", true))
        this.paths.push(SayingVO.say("让我把你教会吧", new Point(50, 50), "test/bike3.jpg", true))
    }

    playPics() {
        if (this.sayingIndex >= this.paths.length) {
            this.sayingIndex = 0
        }

        this.togglePics(this.paths[this.sayingIndex])

        this.sayingIndex++;
    }

    onEnable(): void {
        this._control = this.getComponent(GameControl);
        this.pics.on(Event.CLICK, this, this.togglePics)
    }

    togglePics(say: SayingVO): void {
        let sayingVO = say

        if (sayingVO.isTogglePic && sayingVO.picPath != null) {
            this.pics.graphics.clear()
            this.pics.loadImage(sayingVO.picPath)
        }

        this.question.text = sayingVO.text

        if (sayingVO.point != null) {
            this.question.x = sayingVO.point.x
            this.question.y = sayingVO.point.y
        }

        this.question.fontSize = 60;
        this.question.color = '#ffffff'

    }

}