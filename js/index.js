let mySwiper = new Swiper ('.swiper-container', {
    // direction: 'vertical',
    effect: 'cube',
    // loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // speed:800,
});


$(".add").click(function(){
    $(".mask").show();
    $(".inputarea").transition({y:0},500);
});
$(".cancel").click(function () {

    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    });
});

$(".submit").click(function(){
    var val=$("#text").val();
    $(".submit").show();
    $(".update").hide();
    if(val===""){
        return;
    }
    $("#text").val("");
    var data=getData();
    var time=new Date().getTime();
    data.push({content:val,time,star:false,done:false});
    saveData(data);

    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    });

    render();
});

var state="project";
$(".project").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="project";
    render();
});
$(".done").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
    state="done";
    render();
});
$(".update").click(function(){
    var val=$("#text").val();
    if(val===""){
        return;
    }
    $("#text").val("");
    var data=getData();

    var index=$(this).data("index");
    data[index].content=val;
    saveData(data);

    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide();
    });

    render();
});

$(".itemlist")
    .on("click",".changestate",function(){
        var index=$(this).parent().attr("id");
        // var index=$(this).parent().attr("id");
        console.log(index);
        var data=getData();
        data[index].done=true;
        saveData(data);
        render();

    })
    .on("click",".del",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data.splice(index,1);
        saveData(data);
        render();
    })
    .on("click","span",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].star=!data[index].star;
        saveData(data);
        render();
    })
    .on("click","p",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        $(".mask").show();
        $(".inputarea").transition({y:"0"},500);
        $("#text").val(data[index].content);
        $(".submit").hide();
        $(".update").show();
        $(".update").data("index",index);

    });

function getData(){
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(data){
    localStorage.todo=JSON.stringify(data);
}

function render(){
    var data=getData();
    var str="";
    data.forEach(function (val,index) {

        if(state==="project"&&val.done===false){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+">※</span><div class='changestate'>完成</div></li>"
        }
        else if(state==="done"&&val.done===true){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span class="+(val.star?"active":"")+")+'>※</span><div class='del'>删除</div></li>"
            }
        // console.log($(".itemlist"));
    });
    $(".itemlist").html(str);
    // iscroll.refresh();
    addTouchEvent();
}
render();

function parseTime(time){
    var date=new Date();
    date.setTime(time);
    var year=date.getFullYear();
    var month=setZero(date.getMonth()+1);
    var day=setZero(date.getDate());
    var hour=setZero(date.getHours());
    var min=setZero(date.getMinutes());
    var sec=setZero(date.getSeconds());
    return year+"/"+month+"/"+day+"<br>"+hour+":"+min+":"+sec;
}
function setZero(n){
    return n<10?"0"+n:n;
}

var myScroll = new IScroll('.content', {
    mouseWheel: true,
    scrollbars: true,
    click:true
});

function addTouchEvent(){
    $(".itemlist>li").each(function(index,ele){
        var hammerobj=new Hammer(ele);
        var sx,sy;
        var movex;
        var max=window.innerWidth/5;
        var state="start";
        var flag=true;//手指离开之后要不要有动画

        hammerobj.on("panstart",function(e){
            ele.style.transition="";
            sx=e.center.x;
        });
        hammerobj.on("panmove",function(e){
            let cx=e.center.x;

            let movex=cx-sx;

            if(movex>0&&state==="start"){
                flag=false;
                return;
            }
            if(movex<0&&state==="end"){
                flag=false;
                return
            }
            if(Math.abs(movex)>max){
                flag=false;
                state==="state"?"end":"start";
                return;
            }
            if(state==="end"){
                movex=cx-sx-max;
            }
            flag=true;
            $(ele).css("x",movex);
        });
        hammerobj.on("panend",function(){
            if(!flag){return;}

            if(Math.abs(movex)>max/2){
                $(ele).transition({x:0})
                state="start";

            }
            else{
                $(ele).transition({x:-max})
                state="end";
            }
        });
    })
}