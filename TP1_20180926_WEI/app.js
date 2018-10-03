//Complex numbers
class Complex {
    constructor(re, im) {
        this.re = re
        this.im = im
        return this
    }
    /*get the square of this complex number
    * @method square()
    * @return {Complex} the square of this complex
    */
    square() {
        var squ = new Complex()
        squ.re = this.re * this.re - this.im * this.im
        squ.im = 2 * this.re * this.im
        return squ
    }
    /*get the sum of this complex number and the second one
    * @method sum(second)
    * @param second{Complex}  to summon this
    * @return {Complex} the sum this + second
    */
    sum(second) {
        var summ = new Complex()
        summ.re = this.re + second.re
        summ.im = this.im + second.im
        return summ
    }
    /*get the module of this complex
    * @method module()
    * @return {Number} the module of this complex
    */
    module() {
        var Number = Math.sqrt(this.im * this.im + this.re * this.re)
        return Number
    }
}

//
coordToComplex(x, y, size) = () => {
    return new Complex.constructor(x/size,1-y/size)
}

speedToGray(n) = () => {
    if (n===0) {
        return "0xffffff"
    }
    else if (n = 20) {
        return "0x000000"
    }
    else if((n * 12.8) < 16) {
        n = "0" + (n * 12.8).toString(16)
    }
    else { n=(n * 12.8).toString(16)}
    return "0xff"+n+n+n
}

console.log(speedToGray(0))