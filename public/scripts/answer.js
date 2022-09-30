$(document).ready(function () {

   /* const userData = function(){
        const dataValiue =$.ajax("/answerQuiz")
        .then((data)=>{
            console.log("DATA",data)
            return data;
        })
            return dataValiue;
    };*/
    //console.log(userData())
    $('.answerSection').css('display', 'none');
    $('.clickingButton').on('click', function (e) {
    

        const dataId =  $(this).attr('data-questionId')
        // $('.answerSection').attr("data-questionId")
        const answerId = document.querySelector(`[data-questionId='${dataId}']`).getAttribute('data-questionId')

        if(dataId === answerId){
            // const answerSec = $('.answerSection').find(`[data-questionId=${dataId}]`);
            const answer = document.querySelectorAll(`[data-questionId='${dataId}']`)
            $(answer).toggle()
            console.log(answer)
            //$("ul").find(`[data-slide='${current}']`
            console.log("WORKING",dataId)
        }
        //console.log("click");
        //console.log(e)
        
       
    })
})

