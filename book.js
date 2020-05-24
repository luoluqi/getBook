const got = require('got');
const gbk = require('gbk');
const url = require('url');
const JSDOM = require('jsdom').JSDOM;


let location;

const getBook = async (href) => {
    location = href
    var res = await got({
        url: href,
        responseType: "buffer"
    })
    var body = res.body
     var html = gbk.toString('utf-8',res.body);
     let DOM = new JSDOM(html);
     let document = DOM.window.document;
     var title = document.querySelector('.listH11').textContent
     var desc = document.querySelector('.des p').textContent
     console.log(title)
     console.log(desc)
    
     var menuList = document.querySelectorAll('.mululist a')
    
     for (let m of menuList) {
         console.log(m.textContent, m.href)
     }
}

const getChapter = async (path) => {
    var res = await got({
        url: url.parse(location).hostname + path
    })
    return res.body
}

module.exports = {getBook}



