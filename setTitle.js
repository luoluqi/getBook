const got = require('got');
const {getAccessToken, env} = require("./wx")
const JSDOM = require('jsdom').JSDOM;

const main = async () => {
    var token = await getAccessToken()
    var query = `db.collection('category').doc('70d29fac5ec53e5b001109d158c39feb').get()`
    var res = await got({
        url: ` https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: query
        },
        responseType: "json"
    })
    var category = JSON.parse(res.body.data[0])
    console.log(category)

    query = `db.collection('book')
    .where({
        categoryId: '${category._id}'
    })
    .get()`

    res = await got({
        url: ` https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`,
        method: 'post',
        json: {
            env: env,
            query: query
        },
        responseType: "json"
    })

    var bookList = res.body.data
    console.log(bookList)

    for(let b of bookList) {
        b = JSON.parse(b)
        query = `db.collection('chapter')
        .where({
            bookId: '${b._id}'
        })
        .skip(0)
        .limit(1000)
        .get()`

        res = await got({
            url: ` https://api.weixin.qq.com/tcb/databasequery?access_token=${token}`,
            method: 'post',
            json: {
                env: env,
                query: query
            },
            responseType: "json"
        })

        var chapterList = res.body.data
        for (var c of chapterList) {
            c = JSON.parse(c)
            var name = c.name
            var original = c.original
            var DOM = new JSDOM(original);
            var  document = DOM.window.document;
            var title = document.querySelector('p').textContent
            title = title.replace(/\s+/, " ")
            console.log(name + "" + title)

            var newName = name + " " + title
            query = `db.collection("chapter").doc("${c._id}").update({data:{name: "${newName}"}})`

            res = await got({
                url: `https://api.weixin.qq.com/tcb/databaseupdate?access_token=${token}`,
                method: 'post',
                json: {
                    env: env,
                    query: query
                },
                responseType: "json"
            })
            console.log(res.body.data)
        }
        
        
    }
}


main()

