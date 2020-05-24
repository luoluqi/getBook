const got = require('got');
const gbk = require('gbk');
const url = require('url');
const JSDOM = require('jsdom').JSDOM;

const {addBook, addChapter, removeBook} = require('./wx')

const main = async () => {
    var res = await got({
        url: 'http://www.zanghaihua.org/gushiwen/tangshisanbaishou/'
    })
   

    var bookId = await addBook({
        categoryId:'b05d218a5ec9cabb001a96dd05a4c619',
        name: '唐诗三百首', 
        author:'', 
        desc: `唐诗三百首》是一部流传很广的唐诗选集。唐朝（618年~907年）二百八十九年间，是中国诗歌发展的黄金时代，云蒸霞蔚，名家辈出，唐诗数量多达五万余首。
        孙琴安《唐诗选本六百种提要·自序》指出，“唐诗选本经大量散佚，至今尚存三百余种。当中最流行而家传户晓的，要算《唐诗三百首》。”《唐诗三百首》选诗范围相当广泛，收录了77家诗，共311首，在数量上以杜甫诗最多，有38首、王维诗29首、李白诗27首、李商隐诗22首。`, 
        order:100000
    })

    var DOM = new JSDOM(res.body);
    var  document = DOM.window.document;

    var aList = document.querySelectorAll('.booklist a')
    for (var i = 0;i<aList.length;i++){
        var a = aList[i]
        console.log(i+"、"+aList[i].textContent+";"+aList[i].href)
        res = await got({
            url: a.href
        })
        var html = res.body

        var DOM = new JSDOM(html);
        var  document = DOM.window.document;
        var name =a.textContent
        var original = document.querySelector(".bookcontent").innerHTML
        name = name.replace('作者', '')
        name = name.replace('唐代', '')
        console.log(name)
       var arr = name.split('：')
       console.log(arr)
       name = arr[0] + '('+arr[1]+')'

        console.log(name)
        // console.log(original)

        await addChapter({
            bookId:bookId, 
            name:name, 
            original:original, 
            translation:'', 
            order:i
        })
    }
}

main()