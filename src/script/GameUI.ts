import { ui } from "./../ui/layaMaxUI";
import GameControl from "./GameControl"
import { MouseManager } from "laya/events/MouseManager";
import { Event } from "laya/events/Event";
import { Laya, timer } from "Laya";
import SayingVO from "../model/SayingVO";
import { Point } from "laya/maths/Point";
import { AudioSound } from "laya/media/h5audio/AudioSound";
import { SoundManager } from "laya/media/SoundManager";
import { Text } from "laya/display/Text";
import { Pool } from "laya/utils/Pool";
import { Tween } from "laya/utils/Tween";
import { Ease } from "laya/utils/Ease";
import Color from "../model/Color";
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

    private paths: SayingVO[]

    private startSaying: SayingVO[]

    private say1: Text
    private say2: Text
    private say3: Text
    private say4: Text
    private say5: Text
    private say6: Text

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

        this.stage.once(Event.CLICK, this, this.onStageClick)

        let centerX = Laya.stage.width >> 2
        let centerY = Laya.stage.height >> 2

        this.question.fontSize = 120
        this.question.align = 'center'
        this.question.width = Laya.stage.width
        // this.question.height= Laya.stage.height
        this.question.changeText("准备好了么\n点击我开始吧")
        this.question.pos(0, centerY - 50)

        // this.pics.loadImage('test/starter.jpeg')
        // this.pics.width = Laya.stage.width
        // this.pics.height = Laya.stage.height

        // Laya.stage.bgColor = '#ff99ff'

        this.playMusic(1)
    }

    onEnable(): void {
        this._control = this.getComponent(GameControl);
        // this.pics.on(Event.CLICK, this, this.togglePics)
    }

    onStageClick(e: Event) {
        this.question.visible = false
        this.initSaying()
        this.firstStage()
    }

    playMusic(index: number): any {
        let music: string
        if (index == 1) {
            music = "sound/background_start.mp3"
        } else {
            music = "sound/background.mp3"
        }

        SoundManager.playMusic(music, 0)
    }

    initSaying() {
        this.say1 = new Text();
        this.say2 = new Text();
        this.say3 = new Text(), this.say4 = new Text(), this.say5 = new Text();
        this.say6 = new Text();

        this.addChildren(this.say1, this.say2, this.say3, this.say4, this.say5, this.say6)
    }

    clearSaying(): any {
        let says = [this.say1, this.say2, this.say3, this.say4, this.say5, this.say6]

        says.forEach(function (say) {
            say.visible = false
        })
    }

    firstStage(): void {
        let self = this

        this.drawText(this.say1, "我 要 道 歉 !", new Point(150, 150), 120, "#ffffff", this.toFadeIn, null)
        this.addStroke(this.say1)
        Laya.timer.once(700, this, function () {
            self.addStroke(this.say2)
            self.drawText(this.say2, "因 为 我", new Point(150, 280), 120, "#ffffff", this.toFadeIn, null)

            Laya.timer.once(500, this, function () {

                let offset = 200
                this.say3.visible = this.say4.visible = this.say5.visible = false
                self.drawText(this.say3, "愚蠢", new Point(80, 600), 1, "#ca2f2c", this.toBig, [200, 120])
                self.drawText(this.say4, "自私", new Point(80, 600 + offset), 1, "#ca2f2c", this.toBig, [600, 180])
                self.drawText(this.say5, "冷落", new Point(80, 600 + 2 * offset), 1, "#ca2f2c", this.toBig, [1000, 240])

                Laya.timer.once(3000, this, () => {
                    self.addStroke(this.say6)
                    self.drawText(this.say6, "希望看完这一篇\n你能接受我的道歉。。。", new Point(80, Laya.stage.height - 240), 80, "#ffffff", this.toFadeIn, [])

                    this.goNextStage(2500, this.secondStage)
                }, null, false)
            }, null, false)
        }, null, false)

    }

    goNextStage(time: number, stageImpl: Function) {
        Laya.timer.once(time, this, stageImpl, null, false)
    }

    secondStage() {
        this.clearSaying()
        let self = this

        this.addStroke(this.say1)
        this.drawText(self.say1, "我们这一周的聊天", new Point(40, 150), 100, "#ffffff", this.toFadeIn, null)
        Laya.timer.once(800, self, function () {
            self.drawText(self.say2, "真 的 很 少", new Point(40, 340), 150, "#ff00ff", this.toFadeIn, null)

            Laya.timer.once(500, self, function () {
                self.drawText(this.say3, "这都是我的错", new Point(40, 550), 1, "#ff00ff", this.toBig, [400, 160, 800])

                Laya.timer.once(2400, self, () => {
                    self.addStroke(self.say4)
                    self.addStroke(self.say5)
                    self.drawText(self.say4, "一个除了工作的原因", new Point(40, 780), 100, Color.WHITE, this.toFadeIn)
                    self.drawText(self.say5, "还有一个就是我在准备...", new Point(40, 980), 80, Color.WHITE, this.toFadeIn)

                    Laya.timer.once(2400, self, () => {
                        self.drawText(self.say6, "李老师布置的作业!", new Point(40, 1130), 1, Color.RED, this.toBig, [400, 120, 600, Ease.backOut])

                        self.goNextStage.call(self, 2000, self.thirdStage)
                    }, null, false)
                }, null, false)
            }, null, false)
        })
    }

    thirdStage() {
        this.clearSaying()
        let self = this

        this.addStroke(this.say1)
        this.drawText(self.say1, "上班之后", new Point(40, 150), 100, Color.WHITE, this.toFadeIn, null)
        self.drawText(self.say2, "时 间 真 的 很 少", new Point(40, 340), 150, Color.RED, this.toBig, [900, 140, 400])

        Laya.timer.once(2500, self, function () {
            self.addStroke(this.say3)
            self.drawText(this.say3, "让我们两个人", new Point(40, 550), 100, Color.WHITE, this.toFadeIn)
            self.drawText(this.say4, "都很痛苦，所以", new Point(40, 720), 120, Color.RED, this.toFadeIn)

            Laya.timer.once(2200, self, () => {
                self.addStroke(self.say5)
                self.addStroke(self.say6)
                self.drawText(self.say5, "“作业”。。。", new Point(20, 950), 1, Color.RED, this.toBig, [0, 140, 600])
                Laya.timer.once(2800, self, () => {

                    self.drawText(self.say6, "只能一拖又拖", new Point(40, 1130), 80, Color.WHITE, this.toFadeIn)

                    self.goNextStage.call(self, 2500, self.fourthStage)
                }, null, false)
            }, null, false)
        }, null, false)
    }

    fourthStage() {
        this.clearSaying()
        let self = this

        this.addStroke(this.say1)
        this.drawText(self.say1, "终于到了周末", new Point(40, 150), 120, Color.WHITE, this.toFadeIn, null)
        self.drawText(self.say2, "可以全身心的投入", new Point(40, 340), 1, Color.RED, this.toBig, [900, 120, 500])

        Laya.timer.once(3000, self, function () {
            self.addStroke(this.say3)
            self.addStroke(this.say4)
            self.drawText(this.say3, "把对你的感觉", new Point(40, 550), 100, Color.WHITE, this.toFadeIn)
            self.drawText(this.say4, "全部", new Point(40, 720), 1, Color.WHITE, this.toBig, [700, 120, 400])
            self.drawText(this.say5, "表达出来!", new Point(40, 920), 1, Color.RED, this.toBig, [1700, 180, 600, Ease.backOut])
            self.drawText(this.say6, "请让我对你\n大声说!", new Point(40, 1150), 1, Color.RED, this.toBig, [2700, 180, 500, Ease.backOut])

            self.stage.once(Event.CLICK, self, this.goFormalStage)
        }, null, false)
    }

    goFormalStage() {
        this.clearSaying()
        this.question.width = Laya.stage.width
        this.question.pos(0, 0)
        this.playMusic(2)
        // this.question.height = Laya.stage.height
        this.springStage()
    }

    springStage() {
        let var1: string = '躺进', var2: string = '', var3: string = ''
        if (this.loopCount >= 1 && this.loopCount < 3) {
            var1 = "又回到"
            var3 = '静静地'
        } else if (this.loopCount >= 3) {
            var1 = '一起回忆'
            var2 = "我总是"
            var3 = '就那么'
        }

        this.addStroke(this.question)
        this.question.align = 'left'
        this.question.padding = [100, 0, 0, 40]
        var temp = "让我们var1春天\n在公园里漫步\n轻飘飘的\n累了\nvar2坐在长椅上\n看着你的侧脸\n懒洋洋的\nvar3度过一天".replace("var1", var1).replace("var2", var2).replace('var3', var3)
        this.togglePics(SayingVO.say(temp, null, "test/spring.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.summerStage)
        })
    }

    summerStage() {
        let var1: string = '到了', var2: string = '摘一朵戴上', var3: string = '迷人而美丽'
        if (this.loopCount >= 1 && this.loopCount < 3) {
            var1 = "重新迎接"
            var2 = '采一束'
            var3 = '插进花瓶里'
        } else if (this.loopCount >= 3) {
            var1 = '时光里的'
            var2 = "束发画眉"
            var3 = '就像那些花儿'
        }

        this.addStroke(this.question)
        this.question.align = 'right'
        this.question.padding = [100, 40, 0, ]
        var temp = "var1夏天\n花圃里活力又芬芳\n我会亲手\n为你var2\nvar3\n沉醉不已".replace("var1", var1).replace("var2", var2).replace('var3', var3)
        this.togglePics(SayingVO.say(temp, null, "test/summer.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            if (this.loopCount >= 2) {
                this.goNextStage(500, this.starStage)
            } else {
                this.goNextStage(500, this.fallStage)
            }
        })
    }

    fallStage() {
        let var1: string = '一晃到了', var2: string = '我们相互依偎', var3: string = '我只抬头看你'
        if (this.loopCount >= 1 && this.loopCount < 3) {
            var1 = "重新相遇"
            var2 = '手拉着手'
            var3 = '走过一程又一程'
        } else if (this.loopCount >= 3) {
            var1 = '难忘的那些'
            var2 = "田园里满是富裕"
            var3 = '尝尽离别，彼此珍惜'
        }

        this.addStroke(this.question)
        this.question.align = 'right'
        this.question.padding = [100, 40, 0, 0]
        var temp = "var1秋天\n金黄满地\nvar2\n落叶簌簌\nvar3".replace("var1", var1).replace("var2", var2).replace('var3', var3)
        this.togglePics(SayingVO.say(temp, null, "test/fall.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.winterStage)
        })
    }

    winterStage() {
        let var1: string = '冬季的夜里', var2: string = '嘴里呼着热气', var3: string = '热在手里'
        if (this.loopCount >= 1 && this.loopCount < 3) {
            var1 = "冬天的厨房里"
            var2 = '热气腾腾'
            var3 = '烫在嘴里'
        } else if (this.loopCount >= 3) {
            var1 = '那些走过的冬季'
            var2 = "外面寒冷透骨"
            var3 = '我们互拥在怀里'
        }

        this.addStroke(this.question)
        this.question.align = 'left'
        this.question.padding = [100, 0, 0, 40]
        var temp = "var1\nvar2\nvar3\n暖在心里".replace("var1", var1).replace("var2", var2).replace('var3', var3)
        this.togglePics(SayingVO.say(temp, null, this.loopCount < 2 ? "test/winter2.jpeg" : 'test/winter.jpg', true))

        this.stage.once(Event.CLICK, this, () => {
            if (this.loopCount <= 2) {
                this.goNextStage(500, this.springStage)
                this.loopCount++
            } else {
                this.goNextStage(500, this.bikeStage)
            }
        })
    }

    starStage() {
        this.addStroke(this.question)
        this.question.align = 'center'
        this.question.padding = [100, 0, 0, 0]
        var temp = "最渴望夏夜的星空璀璨\n\n我们看着星空发呆\n\n那里超越了时间和空间\n\n我们也不再分清彼此"
        this.togglePics(SayingVO.say(temp, null, "test/stars.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.fallStage)
        })
    }

    bikeStage() {
        this.addStroke(this.question)
        this.question.align = 'left'
        this.question.padding = [100, 0, 0, 40]
        var temp = "你说过\n想要骑着单车去郊游\n我答应了\n要教你\n"
        this.togglePics(SayingVO.say(temp, null, "test/bike.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.bikeStage2)
        })
    }

    bikeStage2() {
        this.addStroke(this.question)
        this.question.align = 'right'
        this.question.padding = [100, 0, 0, 40]
        var temp = "我们会在一个\n阳光明媚的午后\n骑着单车\n去领略\n风，景\n"
        this.togglePics(SayingVO.say(temp, null, "test/bike2.jpeg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.bikeStage3)
        })

    }

    bikeStage3() {
        this.addStroke(this.question)
        this.question.align = 'right'
        this.question.padding = [100, 40, 0, 0]
        var temp = "那一天说不定\n会发生\n很多有趣的事情\n"
        this.togglePics(SayingVO.say(temp, null, "test/bike3.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.parternerStage)
            this.loopCount++
        })

    }

    parternerStage() {
        this.addStroke(this.question)
        this.question.align = 'right'
        this.question.padding = [100, 40, 0, 0]
        var temp = "如果你真的学不会\n没关系\n有我在\n\n你会愿意\n和我继续走下去的对吧"
        this.togglePics(SayingVO.say(temp, null, "test/parterner.jpg", true))

        this.stage.once(Event.CLICK, this, () => {
            this.goNextStage(500, this.springStage)
            this.loopCount++
        })

    }

    addStroke(text: Text) {
        text.stroke = 5
        text.strokeColor = '#b4b4b4'
    }

    drawText(node: Text, text: string, point: Point, fontSize: number = 60, color: string = null, effect: Function = null, args?: any[]) {
        node.text = text;
        node.fontSize = fontSize
        node.visible = true

        if (point != null) {
            node.pos(point.x, point.y)
        }

        if (color != null) {
            node.color = color
        }

        if (effect != null) {
            effect.apply(node, args)
        }

        node.zOrder = 1
    }

    toBig(time: number, fontSize: number = 120, duration: number = 1000, type: Function = Ease.linearOut) {
        if (this instanceof Text) {
            this.visible = true
            this.fontSize = 1
            Tween.to(this, { fontSize: fontSize }, duration, type, null, time)
        }
    }

    toFadeIn() {
        if (this instanceof Text) {
            this.alpha = 0
            this.visible = true
            Tween.to(this, { alpha: 1 }, 400, Ease.linearIn, null)
        }
    }

    togglePics(say: SayingVO): void {
        let sayingVO = say

        if (sayingVO.isTogglePic && sayingVO.picPath != null) {
            this.pics.graphics.clear()
            this.pics.loadImage(sayingVO.picPath)
        }

        this.question.text = sayingVO.text
        this.question.visible = true

        if (sayingVO.point != null) {
            this.question.x = sayingVO.point.x
            this.question.y = sayingVO.point.y
        }

        this.question.fontSize = 80;
        this.question.color = Color.WHITE

        Tween.to(this.question, { alpha: 1 }, 600, Ease.linearOut, null, 200, true)

    }

}