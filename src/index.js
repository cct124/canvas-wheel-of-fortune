class Bez {
    constructor({ poin, p1, p2, c1, c2 }) {
        this.p1 = p1 || [0, 0];
        this.p2 = p2 || [1, 1];
        this.c1 = c1;
        this.c2 = c2;
        this.poin = 1 / poin;
        this.poins = [];
    }

    runBez(cx1, cy1, cx2, cy2) {
        this.c1 = [cx1, cy1];
        this.c2 = [cx2, cy2];
    }

    line() {
        this.run(this.lineBezier, this.p1, this.p2);
    }

    flat() {
        this.run(this.flatBezier, this.p1, this.p2, this.c1);
    }

    cubic() {
        this.run(this.cubicBezier, this.p1, this.p2, this.c1, this.c2);
    }

    pre(arr) {
        return arr.map(n => Math.round(n * 10000) / 10000)
    }

    run(fun, ...parat) {
        for (let index = 0; index < 1; index += this.poin) {
            const coor = fun(index, ...parat);
            this.poins.push(this.pre(coor));
        }
    }

    /**
      * @desc 一阶贝塞尔
      * @param {number} t 当前百分比
      * @param {Array} p1 起点坐标
      * @param {Array} p2 终点坐标
      */
    lineBezier(t, p1, p2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        let x = x1 + (x2 - x1) * t;
        let y = y1 + (y2 - y1) * t;
        return [x, y];
    }

    /**
      * @desc 二阶贝塞尔
      * @param {number} t 当前百分比
      * @param {Array} p1 起点坐标
      * @param {Array} p2 终点坐标
      * @param {Array} cp 控制点
      */
    flatBezier(t, p1, p2, cp) {
        const [x1, y1] = p1;
        const [cx, cy] = cp;
        const [x2, y2] = p2;
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
    }

    /**
      * @desc 三阶贝塞尔
      * @param {number} t 当前百分比
      * @param {Array} p1 起点坐标
      * @param {Array} p2 终点坐标
      * @param {Array} cp1 控制点1
      * @param {Array} cp2 控制点2
      */
    cubicBezier(t, p1, p2, cp1, cp2) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [cx1, cy1] = cp1;
        const [cx2, cy2] = cp2;
        let x =
            x1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cx1 * t * (1 - t) * (1 - t) +
            3 * cx2 * t * t * (1 - t) +
            x2 * t * t * t;
        let y =
            y1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cy1 * t * (1 - t) * (1 - t) +
            3 * cy2 * t * t * (1 - t) +
            y2 * t * t * t;
        return [x, y];
    }
}

class Whell {
    constructor({ canvas, canvasW, canvasH, bgc, shrink }) {
        this.canvasW = canvasW;
        this.canvasH = canvasH;
        this.imgW = null;
        this.imgH = null;
        this.sWidth = null;
        this.sHeight = null;
        this.bgc = bgc;
        this.ctx = canvas;
        this.degSum = 0;
        this.degree = 0;
        this.ctrX = null;
        this.ctrY = null;
        this.diffX = null;
        this.diffY = null;
        this.rotaDegr = null;
        this.circle = 360;
        this.shrink = shrink || 0.9
        this.init();
    }

    async init() {
        this.imgW = this.bgc.width;
        this.imgH = this.bgc.height;
        this.ctrX = this.canvasW / 2;
        this.ctrY = this.canvasH / 2;
        this.sWidth = this.MCW(this.shrink);
        this.sHeight = this.MCH(this.shrink);
        this.diffX = (this.canvasW - this.sWidth) / 2;
        this.diffY = (this.canvasW - this.sWidth) / 2;
    }

    MCW(val) {
        return this.canvasW * val;
    }

    MCH(val) {
        return this.canvasH * val;
    }

    CWAH(img, w) {
        const { width, height } = img;
        const ratio = width / height;
        return w / ratio;
    }

    drawBgcImg() {
        this.ctx.clearRect(-this.sWidth / 2, -this.sHeight / 2, this.canvasW, this.canvasH);
        this.ctx.drawImage(this.bgc, 0, 0, this.imgW, this.imgH, -this.sWidth / 2, -this.sHeight / 2, this.sWidth, this.sHeight);
    }

    translate() {
        this.ctx.translate(this.ctrX, this.ctrY);
    }

    recoTranslate() {
        this.ctx.translate(-this.ctrX, -this.ctrY);
    }

    drawRotateWheel(degree) {
        this.degSum += degree;
        this.degree = degree;
        this.rotaDegr = this.degSum % 360;
        this.rotateDegree(this.rotaDegr);
        this.drawBgcImg();
        this.rotateDegree(-this.rotaDegr);
    }

    rotateDegree(deg) {
        this.ctx.rotate(deg * Math.PI / 180);
    }

}

class Poin extends Whell {
    constructor({ canvas, canvasW, canvasH, bgc, poin, poinWidth, poinX, poinY, poinDeg, poinCenter }) {
        super({ canvas, canvasW, canvasH, bgc });
        this.poin = poin;
        this.poinDeg = poinDeg || 0;
        this.pW = this.poin.width;
        this.pH = this.poin.height;
        this.poinWidth = poinWidth;
        this.poinCenter = poinCenter;
        this.poinHeight = this.CWAH(this.poin, this.poinWidth);
        this.poinX = poinX || -this.poinWidth / 2;
        this.poinY = poinY || this.poinCenter ? -this.poinHeight / 2 : (-this.sHeight - this.poinHeight * 0.3) / 2;
        this.darwPoinDeg = poinDeg ? this._darwPoinDeg : this._darwPoinDegDef;
    }

    darwPointer() {
        this.ctx.drawImage(this.poin, 0, 0, this.pW, this.pH, this.poinX, this.poinY, this.poinWidth, this.poinHeight);
    }

    _darwPoinDegDef() {
        this.darwPointer();
    }

    _darwPoinDeg() {
        this.rotateDegree(this.poinDeg);
        this.darwPointer();
        this.rotateDegree(-this.poinDeg);
    }
}

class Fortune extends Poin {
    constructor({ poinCenter = false, coeDou, thre, poinNum, fps, prizeInfo, spinNum, canvas, canvasW, canvasH, bgc, poin, poinWidth, poinX, poinY, poinDeg, rate }) {
        super({ canvas, canvasW, canvasH, bgc, poin, poinWidth, poinX, poinY, poinDeg, poinCenter });
        this.rate = rate || 10;
        this.bezRate = this.rate;
        this.animInter = null;
        this.prizeInfo = prizeInfo;
        this.degMatIndex = null;
        this.spinNum = spinNum || 3;
        this.drawTime = fps ? parseInt(1000 / fps) : parseInt(1000 / 60);
        this.degNum = null;
        this.thre = thre || 5;
        this.prize = null;
        this.bezier = null;
        this.poinNum = poinNum || 100;
        this.step = 0;
        this.stepArr = [];
        this.stepIn = 1;
        this.prevStep = 0;
        this.coeDou = coeDou || 40;
    }

    start(index) {
        if(!this.bezier) this.bez();
        return new Promise((resolve, reject) => {
            const prize = index !== undefined ? index : this.random(0, this.prizeInfo.length - 1)
            this.assignPrize(prize).then(resolve);
        })
    }

    bez(cx1 = 0.5, cy1 = 0.5, cx2 = 0.5, cy2 = 0.5) {
        this.bezier = new Bez({ poin: this.poinNum, c1: [cx1, cy1], c2: [cx2, cy2] });
        this.bezier.cubic();
    }

    assignPrize(index) {
        return new Promise((resolve, reject) => {
            this.degNum = this.handleDeg(index) + this.spinNum * this.circle + this.poinDeg;
            this.step = this.degNum / this.poinNum;
            this.stepArr = this.generateArray(0, this.poinNum - 1).map(num => parseInt(num * this.step));


            this.animInter = setInterval(() => {
                if (this.degSum >= this.degNum) {
                    resolve(this.end());
                }
                if (this.degSum >= this.stepArr[this.stepIn]) {
                    this.rateBezier(this.stepIn);
                    this.stepIn++;
                }
                this.darwFortune();
            }, this.drawTime);
        })
    }

    generateArray(start, end) {
        return Array.from(new Array(end + 1).keys()).slice(start)
    }

    rateBezier(index) {
        const [x, y] = this.bezier.poins[index];
        const coeStep = y - this.prevStep;
        this.prevStep = y;
        this.bezRate = 1 + coeStep * this.rate * this.coeDou;
    }

    end() {
        clearInterval(this.animInter);
        this.prize = this.prizeInfo[this.degreeMatch()]
        return this.prize;
    }

    handleDeg(index) {
        const tar = this.prizeInfo[index];
        const max = this.circle - tar.ds[1] + this.thre;
        const min = this.circle - tar.ds[0] - this.thre - this.rate
        const random = this.random(max, min);
        return random
    }

    degreeMatch() {
        const deg = this.circle - this.rotaDegr + this.poinDeg;
        const index = this.prizeInfo.findIndex(pr => deg > pr.ds[0] && deg <= pr.ds[1]);
        this.degMatIndex = index;
        return index;
    }

    darwFortune() {
        this.translate();
        this.drawRotateWheel(this.bezRate);
        this.darwPoinDeg();
        this.recoTranslate();
    }

    random(min, max) {
        return parseInt(Math.random() * (max - min + 1) + min, 10)
    }
}

export default { Bez, Poin, Whell, Fortune }
