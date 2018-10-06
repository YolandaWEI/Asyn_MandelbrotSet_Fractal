'use strict'

/** Mandelbrot Set Fractal Image
 * @Author: YolandaW
 * @Date:2018-10-06
 * @Language:JS
 * @Course:Event-drive Asynchronous Programming
 * @Version:1.0
 */

//require module
const readline = require('readline'),
      Jimp = require("jimp");   

//constants
const MAX_ITER = 20,//Iteration times
                    //square in coordinate
      X_MIN = -1,   //lower left quarter position in coordinate is (X_MIN,Y_MIN) 
      Y_MIN = -1,
      X_MAX = 1,    //highter right quarter position in coordinate is (X_MAX,Y_MAX) 
      Y_MAX = 1;

//readline initialize
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

/**question1:
 *Ask image size
 * */
const question1 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Size of the image to generate? ', (size) => {

            //input control
            if ((/^\d+$/.test(size)) && (size > 0) && (size <= 1080)) {
                console.log('Choice of dimensions:' + size + " x " + size + " px")
                //size{String} are all numbers and size is in [1,1080] integer
                return resolve(size)
            } else {
                resolve(question1())
            }
        })
    })
}
/*question2
 *Ask image name
 * */
const question2 = () => {
    return new Promise((resolve, reject) => {
        rl.question('Image Name? ', (name) => {
            console.log(name + ".png on DESKTOP")
            return resolve(name)
        })
    })
}

/**Complex numbers
 *Class Complex
 * @constructor
 * @method square()  
 * @method sum()
 * @method module()
 */
class Complex{
    /** @constructor */
    constructor(re, im){
        this.re = re
        this.im = im
        return this
    }
    /**get the square of this complex number
     * @method square()
     * @return {Complex} the square of this complex
     */
    square() {
        var squ = new Complex()
        squ.re = this.re * this.re - this.im * this.im
        squ.im = 2 * this.re * this.im
        return squ
    }
    /**get the sum of this complex number and the second one
     * @method sum(second)
     * @param {Complex} second  to summon this
     * @return {Complex} the sum this + second
     */
    sum(second) {
        var summ = new Complex()
        summ.re = this.re + second.re
        summ.im = this.im + second.im
        return summ
    }
    /**get the module of this complex
     * @method module()
     * @return {Number} the module of this complex
     */
    module() {
        var Number = Math.sqrt(this.im * this.im + this.re * this.re)
        return Number
    }
}

//functions:

/** get a (x,y) pixel in a size x size square image and create a complex number{Complex} in complex plane coordinate
 * @method coordToComplex(x,y,size)
 * @param {Integer} x pixel (x,y)
 * @param {Integer} y pixel (x,y)
 * @param {Integer} size image square size x size
 * @return {Complex} the Complex created by point(x,y) and size
 */
function coordToComplex(x, y, size) {
    return new Complex(X_MIN+(X_MAX-X_MIN)*(x / size), Y_MIN+(Y_MAX-Y_MIN)*(1 - y / size))
}

/**get the gray color in Hexadecimal RGBA by the iteration n
 *n=0 is black and n=20(MAX_ITER) is white 
 * @method speedToGray(n)
 * @param  {Integer} n iteration
 * @return {Hexadecimal Integer} the hexadecimal integer which is a pixel RGBA color (full opacity: ff for Alpha)
 */
function speedToGray(n) {
    const GRAY_ORDER = 12.6; //MAX 12.6
   
    if (n <= 0) {
        return "0xffffffff";
    }
    else if (n >= MAX_ITER) {
        return "0x000000ff";
    }
    else {
        if ((256 - n * GRAY_ORDER) < 16) {
            n = parseInt(256 - n * GRAY_ORDER).toString(16);
        }
        else {
            n = parseInt(256 - n * GRAY_ORDER).toString(16);
        }
        return "0x" + n + n + n + "ff";
    }
}

/** get the iter level after check if the point (x,y)
 * @method getIterLevel(x,y,size)
 * @param {Integer} x pixel(x,y)
 * @param {Integer} y pixel(x,y)
 * @param {Integer} size image square size x size
 * @return {Integer} the iteration level when z.module>2
 */
function getIterLevel(x,y,size) {
    // get the point C(x,y){Complex} from pixel(x,y,size)
    var pointC = coordToComplex(x,y,size)

    //get the iteration level n
    var z = new Complex(0, 0)
    var n = 0
    while (n < MAX_ITER) {
        z = z.square()
        z = z.sum(pointC)
        if (z.module() > 2) return n  //for smooth  return n + 1 - Math.log2(Math.log2(z.module())) 
        n = n + 1
    }
    return MAX_ITER
}

/**
 * get the color in Hexadecimal RGBA by the iteration level n
 * @param {Integer} n the iteration level n
 * @return {Hexadecimal Integer} the hexadecimal integer which is a pixel RGBA color (full opacity: ff for Alpha)
 */
function speedToColor(n) {
    n = Math.min(n / 50, 1)
    let s = 1
    let l = 0.6, r, g, b

    if (s === 0) {
        r = g = b = l // achromatic
    } else {

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1 / 6) return p + (q - p) * 6 * t
            if (t < 1 / 2) return q
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
            return p
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s
        var p = 2 * l - q
        r = hue2rgb(p, q, n + 1 / 3)
        g = hue2rgb(p, q, n)
        b = hue2rgb(p, q, n - 1 / 3)
    }

    return Jimp.rgbaToInt(
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        255
    )
}

/**build a Fractal Image 
 * @method buildGreyFractal(size,name)
 * @param {Integer} size the image is size x size px
 * @param {String} name the image is create as "name.png" on Destop 
 * @return {Complex} the Complex created by point(x,y) and size
 */
function buildGreyFractal(size, name){
    const DESKTOP_URL = "C:\\Users\\YolandaW\\Desktop\\"
    name = name + ".png" //add suffix
    //Generate a image
    var image = new Jimp(size, size)

    //initialize loop
    var n = 0
    
    //draw the image
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            //get Gray level
            n = getIterLevel(i, j, size) 
            // Draw this pixel as gray level colour (n)
            image.setPixelColor(parseInt(speedToGray(n)), i, j) //change function speedToColor(n) and create a colorful image
            
        }
    }

     
    //save the image
    image.write(DESKTOP_URL + name) //save   

}

//main
const main = async () => {
    var size = await question1()
    var name = await question2()
    console.log(name + ".png: " + size + " x " + size + " px")

    //build image
    buildGreyFractal(size, name)

    //quit
    rl.question('Quit? ', () => {
        rl.close()
    })
}

//execute
main()