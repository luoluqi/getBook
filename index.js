const got = require('got');
const gbk = require('gbk');
const url = require('url');
const JSDOM = require('jsdom').JSDOM;

const {addBook, addChapter, removeBook} = require('./wx')

let location;

const getChapter = async (bookId, title,href, order) => {
   
    if (!href){
        return
    }
    var res = await got({
        url: href,
        // responseType: "buffer"
    })
    var html = res.body
    // console.log(html)
     var DOM = new JSDOM(html);
     var  document = DOM.window.document;
     var title = document.querySelector('.cont b').innerHTML
     console.log(title)
     console.log("=======================")
     
    var origin = document.querySelector('.contson').innerHTML
   
    console.log(origin)
    console.log("=======================")
    var listA = document.querySelectorAll('.cont h1 a')
    var transA = listA[listA.length - 1]
    var trans = ''
    if (transA) {
        var transId = transA.id.replace('leftbtn', '')

        res = await got({
            url: 'https://so.gushiwen.cn/guwen/ajaxbfanyi.aspx?id=' + transId
        })
       
        DOM = new JSDOM(res.body);
    
        document = DOM.window.document;
        var h2 = document.querySelector('.shisoncont h2')
        if (h2) {
            h2.parentNode.removeChild(h2)
            trans = document.querySelector('.shisoncont').innerHTML
            console.log(trans)  //shisoncont
        }
       
    }
   
    await addChapter({
        bookId:bookId, 
        name:title, 
        original:origin, 
        translation:trans, 
        order:order
    })
  
    
}

const getBook = async (categoryId,path) => {
    var res = await got({
        url: path
    })
    var html = res.body
    var DOM = new JSDOM(html);
    var  document = DOM.window.document;
    var bookName = document.querySelector('.cont b').textContent

    var aEl = document.querySelectorAll('.cont a')
    for(var item of aEl){
        item.parentNode.removeChild(item)
    }
    

    // console.log(bookName)
    var bookDesc = document.querySelector('.cont p').textContent
    // bookDesc = bookDesc.replace(/[0-9]+条名句/, '')
    // console.log(bookDesc)
    var bookId = await addBook({
        categoryId:categoryId, 
        name:bookName, 
        author:'', 
        desc:bookDesc, 
        order:100000
    })
    var chapterList = document.querySelectorAll('.bookcont a')
    for (let i = 0; i< chapterList.length;i++){
        let c = chapterList[i]
        let href = c.href
       
      
        await getChapter(bookId, c.textContent, href, i)
    }
    
}


getBook('982133855ec3cf58010169fe0edb4ee3', 
'https://so.gushiwen.org/guwen/book_46653FD803893E4FFD16AE8D25EE468A.aspx')

// getChapter("1", "" , "https://so.gushiwen.cn/guwen/bookv_46653FD803893E4F18BE1020606DF928.aspx", 1)

// removeBook('c9327f835ec53a39000efd0c0b8d3079')




