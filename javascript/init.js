//fetch("/json/init.json").then((resp)=>resp.json()).then((json)=>console.log(json))

const init={
    "Column":[
        {
            "Name":"해야할 일",
            "ID":"todo",
            "Lists":[{
                "CardID":1,
                "Title":"GitHub 공부하기",
                "Body":"add, commit, push",
                "Author":"web"
            },{
                "CardID":2,
                "Title":"블로그에 포스팅할 것",
                "Body":"GitHub 공부내용\n모던 자바스크립트 공부내용",
                "Author":"web"
            }]
        },
        {
            "Name":"하고있는 일",
            "ID":"doing",
            "Lists":[{
                "CardID":3,
                "Title":"Javascript 공부하기",
                "Body":"addEventListener",
                "Author":"web"
            }]
        },
        {
            "Name":"완료한 일",
            "ID":"done",
            "Lists":[]
        }
    ]
};