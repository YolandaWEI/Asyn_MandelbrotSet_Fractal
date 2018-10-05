'use strict'

const MAX_ITER = 20 //Iteration times


//square in coordinate
//lower left quarter position is (X_MIN,Y_MIN) in coordinate
const X_MIN = -1 
const Y_MIN = -1
//highter right quarter position is (MAX,MAX) in coordinate
const X_MAX = 1 
const Y_MAX = 1 

const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

//Complex numbers 
class Complex{
    constructor(re, im){
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
    /*
    * @method coordToComplex()
    * @return {Complex} the Complex created by point(x,y) and size
    */
function coordToComplex(x, y, size) {
    return new Complex(X_MIN+(X_MAX-X_MIN)*(x / size), Y_MIN+(Y_MAX-Y_MIN)*(1 - y / size))
}


function speedToGray(n) {
    const GRAY_ORDER = 12.6 //MAX 12.6
    if (n <= 0) {
        return "0xffffffff"
    }
    else if (n >= MAX_ITER) {
        return "0x000000ff"
    }
    else {
        if ((256 - n * GRAY_ORDER) < 16) { n = parseInt(256 - n * GRAY_ORDER).toString(16) }
        else { n = parseInt(256 - n * GRAY_ORDER).toString(16) }
        return "0x" + n + n + n + "ff"
    }
}

function getGrayPixel(i,j,size) {
    // get the Complex(x,y) from pixel(i,j) 
    var pointC = coordToComplex(i,j,size)

    //get the Gray level n
    var z = new Complex(0, 0)
    var n = 0
    while (n < MAX_ITER) {
        z = z.square()
        z = z.sum(pointC)
        if (z.module() > 2) return n  //for smooth return n + 1 - Math.log2(Math.log2(z.module())) 
        n = n + 1
    }
    return MAX_ITER
}

function smooth(n) {
    n=n+1-Math.log2(Math.log2(z.module()))
}


function buildGreyFractal(size, name){
    const DESKTOP_URL = "C:\\Users\\YolandaW\\Desktop\\"
    name = name + ".png" //add suffix
    //Generate a image
    const Jimp = require("jimp")
    var image = new Jimp(size, size)

    //initialize loop
    var n = 0
    
    //draw the image
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            //get Gray level
            n = getGrayPixel(i, j, size) 
            
            // Draw this pixel as gray level colour (n)
            image.setPixelColor(parseInt(speedToGray(n)), i, j) 
            
        }
    }

     
    //save the image
    image.write(DESKTOP_URL + name) //save   

}


//execute
buildGreyFractal(2048, "2048px")

//quit
rl.question('Quit? ', () => {
    rl.close()
})

