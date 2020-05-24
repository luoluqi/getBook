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
     var title = document.querySelector('.cont h1').innerHTML
     var author = document.querySelector('.cont .source').textContent
     var id = document.querySelectorAll('.yizhu img')[1].id
     id = id.replace('btnShangxi', '')
     console.log(title + " —— (" + author + ")")
     console.log(id)
     console.log("=======================")
     
     var url = 'https://so.gushiwen.cn/nocdn/ajaxshiwencont.aspx?id='+id+'&value=yi'
    console.log(url)
    res = await got({
        url: url,
        // responseType: "buffer"
    })

   
   
    console.log(res.body)
    console.log("=======================")
   
   
    // await addChapter({
    //     bookId:bookId, 
    //     name:title, 
    //     original:origin, 
    //     translation:trans, 
    //     order:order
    // })
  
    
}

const getBook = async (categoryId,path) => {
    var res = await got({
        url: path
    })
    var html = res.body
    var DOM = new JSDOM(html);
    var  document = DOM.window.document;
    var bookName = document.querySelector('.title h1').textContent

   
    console.log(bookName)
    var bookId  = 0
    // var bookId = await addBook({
    //     categoryId:categoryId, 
    //     name:bookName, 
    //     author:'', 
    //     desc:bookDesc, 
    //     order:100000
    // })
    var chapterList = document.querySelectorAll('.sons .typecont a')
    console.log(chapterList)
    for (let i = 0; i< chapterList.length;i++){
        let c = chapterList[i]
        let href = c.href
       
      
        await getChapter(bookId, c.textContent, href, i)
    }
    
}


getBook('b05d218a5ec9cabb001a96dd05a4c619', 
'https://www.gushiwen.org/gushi/tangshi.aspx')







