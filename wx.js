const fs = require("fs");
const got = require('got');

const appId = 'wx5da44835dac1892e'
const appSecret = '6e75d11d9964510f2d86218839ffe1c9'
const env = 'book-e9sdz'

let access_token = ''

const getAccessToken = async () => {
    if (access_token) {
        return access_token
    }
    res = await got({
        url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
        responseType: "json"
    })
    
    access_token =res.body.access_token
    console.log(res.body)
    return access_token
}

const databaseAdd = async (query) => {
  
    var token = await getAccessToken()
    var res = await got({
        url: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: query
        },
        responseType: "json"
    })
    return res.body
}

const addCategory = async ({name, order}) => {
    let query = `
    db.collection('category').add({
        data: {
           
            name: "${name}",
          
            order: ${order}
        }
      })
    `
    var res = await databaseAdd(query)
    console.log('================')
    console.log(res.id_list[0])
    return res.id_list[0]
}

const addBook = async ({categoryId, name, author, desc, order}) => {
    desc = desc.replace(/[\r\n]/g,""); 
    desc = desc.replace(/"/g, "”")
    let query = `
    db.collection('book').add({
        data: {
            categoryId: "${categoryId}",
            name: "${name}",
            author: "${author}",
            desc: "${desc}",
            order: ${order}
        }
      })
    `
    var res = await databaseAdd(query)
    console.log('================')
    console.log(res)
    console.log(res.id_list[0])
    return res.id_list[0]
}

const addChapter = async ({ bookId, name, original, translation, order }) => {
    original = original.replace(/[\r\n]/g,""); 
    original = original.replace(/"/g, "”")
    translation = translation.replace(/[\r\n]/g,""); 
    translation = translation.replace(/"/g, "”")
  
    let query = `
    db.collection('chapter').add({
        data: {
            bookId: "${bookId}",
            name: "${name}",
            original: "${original}",
            translation: "${translation}",
            order: ${order}
        }
      })
    `
    try {
        var res = await databaseAdd(query)
        console.log('================')
        console.log(res)
        console.log(res.id_list[0])
    } catch (error) {
        var now = new Date()
        var nowStr = now.getFullYear()+'-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
        fs.writeFile('./error.txt',error + '-' + nowStr + '\n',{flag:'a',encoding:'utf-8',mode:'0666'},function(){

        })
    }
   
   
}

const removeBook = async (bookId) => {
    var token = await getAccessToken()
    var query = `db.collection('book').doc('${bookId}').get()`
    var res = await got({
        url: ` https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: query
        },
        responseType: "json"
    })
    // var book =  JSON.parse(res.body.data[0])

    res = await got({
        url: `https://api.weixin.qq.com/tcb/databasedelete?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: `db.collection("book").doc("${bookId}").remove()`
        },
        responseType: "json"
    })

    res = await got({
        url: `https://api.weixin.qq.com/tcb/databasedelete?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: `db.collection("chapter").where({bookId:'${bookId}'}).remove()`
        },
        responseType: "json"
    })

    var a = 1
}
// 70d29fac5ec53e5b001109d158c39feb
// 54bac78c5ec7e0a2001777561ba6f624

const updateBookId = async () => {
    var token = await getAccessToken()
    var query = `db.collection('book').where().get()`
    var res = await got({
        url: ` https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: query
        },
        responseType: "json"
    })
}


module.exports = {addBook, addChapter, removeBook, getAccessToken, env}
