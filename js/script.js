//封装一个代替getElementById()的方法
function byId(id) {
    //我们知道id都是字符串
    return typeof (id) === "string"? document.getElementById(id):id;
}
/**每隔3秒切换下一张图片：轮播图本身是display：none隐藏的，因为当前图片添加了slide-active类才能显现出来，
所以需要移动slide-active到当前显示图片上才行，需要索引才知道当前是那张图片应该显示，*/
//全局变量
var index = 0,
    timer = null,
    pics = byId("banner").getElementsByTagName("div"),
    //banner中div个数肯定与dots中span个数相同，为len。
    dots = byId("dots").getElementsByTagName("span"),
    prev = byId("prev");
    next = byId("next");
    len = pics.length;
    menu = byId("menu-content");
    subMenu = byId("sub-menu");
    innerBox = subMenu.getElementsByClassName("inner-box");
    menuItems = menu.getElementsByClassName("menu-item");

function slideImg() {

    //取出触发鼠标离开就开始计时的区域
    var main = byId("main");
    //绑定事件：滑过清楚定时器，离开继续
    main.onmouseover = function () {
        //划过，清除定时器
        if (timer) {
            clearInterval(timer);
        }
    }
    //绑定事件：鼠标离开，定时器开始计时
    main.onmouseout = function () {
        //setInterval间歇调用；setTimeout超时定时器
        //也就是每隔3秒让slide-active来到下一张图片中
        timer = setInterval(function () {
            index++;
            if (index>=len){
                index = 0;
            }
            //切换图片
            changeImg();
        },3000);
    }

    //调用上面的onmouseout方法：自动在main上触发鼠标离开的事件
    main.onmouseout();

    /**
     *点击圆点切换图片，遍历所有点击，且绑定点击事件。
     * 不能写在changeImg（）中，因为我们需要进页面就可以点击圆点
     */
    for (var d = 0;d<len;d++){
        /**
         * 给所有span添加一个id的属性，值为d，作为当前span的索引
         * 为什么要做这一步？
         * 因为function函数会改变变量的作用域，即d被遍历一遍之后，
         * 再传入function中的只会是d++后的最大值，根本无法获取到d的真正当前值。
         */
        dots[d].id = d;
        dots[d].onclick = function () {
            //改变index为当前span的索引
            index = this.id;
            changeImg();
        }
    }

    //下一张图片按钮
    next.onclick = function () {
        index++;
        if (index>=len){
            index = 0;
        }
        changeImg();
    }

    //上一张图片按钮
    prev.onclick = function () {
        index--;
        if (index<0){
            index = len-1;
        }
        changeImg();
    }

    //导航菜单
    //遍历主菜单，且绑定事件
    for (var m = 0;m<menuItems.length;m++){
        //给每一个menu-item定义data-index属性，作为索引；不建议添加id，其值会跟圆点id重复
        menuItems[m].setAttribute("data-index",m);
        menuItems[m].onmouseover = function () {
            var idx = this.getAttribute("data-index");
            subMenu.className = "sub-menu";
            /**
             * 触发鼠标滑过事件之后，遍历让所有子菜单innerBox隐藏
             * 然后滑到那个就让那个显示
             */
            for (var j = 0;j<innerBox.length;j++){
                innerBox[j].style.display = 'none';
                menuItems[j].style.background = 'none';
            }
            menuItems[idx].style.background = 'rgba(0,0,0,0.1)';
            innerBox[idx].style.display = "block";
        }
    }

    //鼠标离开主菜单，即把二级菜单隐藏
    menu.onmouseout = function () {
        subMenu.className = "sub-menu hide";
    }

    //鼠标滑过二级菜单时，让其显示
    subMenu.onmouseover = function () {
        this.className = "sub-menu";
    }
    //鼠标离开二级菜单时，让其隐藏
    subMenu.onmouseout = function () {
        this.className = "sub-menu hide";
    }

}

//切换图片；index为全局函数，不需要传入
function changeImg() {
    //先遍历banner下所有的div及dots下所有span，将div隐藏，span清除类。
    for (var i=0;i<len;i++){
        pics[i].style.display = "none";
        dots[i].className = "";
    }
    /**
     *找到当前div和span，将其展示出来，若无上面的遍历，
     *则一轮轮播后，所有轮播元素都被加上了display = “block”。
     */
    pics[index].style.display = 'block';
    /**
     * 为什么这里可以使用.className？
     * 因为1.css中.dots span.active设置的属性很多，这样设置起来便捷
     * 2.圆点导航的span的类属性只有active，这样设置后没有影响其他。
     */
    dots[index].className = 'active';
}

/**
 * 轮播图整体执行流程：
 * 先执行slideImg()，其中有各种绑定事件，依次讨论，想到哪儿写到哪儿；
 * 1.先写自动轮播和鼠标悬停停止轮播的实现 2.再写圆点点击实现或者上下一页跳转的实现。
 * 因为涉及到多次getElementById操作，所以做了封装来简化。
 * 整个流流程都在操作index，index为操作核心，所以必须做成全局变量。
 */
slideImg();
