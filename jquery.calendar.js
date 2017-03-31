/**
 * Created by tony on 2017/3/31.
 * @param
 * @param
 */
;(function($){
  jQuery.fn.extend({
    showCalendar:function(options){
      var defaultOptions = {
        //class名称
        className:'strongCalendar',
        //日历格式'yyyy-MM-dd'('yyyy-MM-dd','yyyy年MM月dd日')
        // format:'yyyy-MM-dd',
        //默认宽度
        width:'700px',
        //背景颜色
        bgcolor:'#fff',
        //头部padding值
        paddingNum:'10px',
        //头部bgcolor
        topColor: '#f9faf7',
        //箭头颜色
        arrowColor:'#ff5500',
        //表格的高度
        tdWidth:'25px',
        //表格的宽度
        tdHeight:'40px',
        //表格的行高
        tdLineH: "21px",
        //表格的边框宽颜色
        tdbodercolor:'#f2f2f2',
        //表格星期背景颜色
        tdheadbgcolor:'#f0f0f0',
        //表格的背景色
        tdbgcolor:"#fff",
        //默认字体的颜色
        tdfontcolor:'#555',
        //追加元素的颜色
        tipcolor:'#ff5500',
        //鼠标hover颜色
        dateHoverBgColor:'#246e96',
        //鼠标hover字体颜色
        dateHoverFontColor:'#fff',
        // //高度,默认220px
        // height:220,
        // //宽度:默认与文本框宽度相同
        // width:$(this).innerWidth(),
        //日历框离文本框高度
         marginTop: 5,
        //浮层z-index
         zIndex:99,
        // 字体大小,默认14px
         fontSize:14,
        //是否显示其他的月份
        showOthermonth: false,
        //操作每天的表格
        dayInfo:{
          starttime: '',
          endtime: '',
          price:"316"
        },
        operate:function(){}
      };
      var settings = jQuery.extend(defaultOptions,options || {}),
          $body = $("body"),
          date = new Date(),
          currentYear = date.getFullYear(),
          currentMonth = date.getMonth(),
          monthDay = [],
          $calendar,
          Year1,Month1,
      //触发事件对象
          $target = $(this),
          current ;
      //对于小于10的数字前+0
      Number.prototype.addZero = function(){
        return this<10?"0"+this:this;
      };
      var Calendar = {
        //星期列表
        weeks : ['日','一','二','三','四','五','六'],
        //每月的天数
        months : [31,0,31,30,31,30,31,31,30,31,30,31],
        //初始化日历
        loadCalendar:function(){
          $body.append("<div class="+settings.className+"></div>");
          $calendar = $("."+settings.className);
          //新增核心html
          $calendar.append(Calendar.innerHTML());

          if(currentMonth==11){
            Year1 = currentYear+1;
            Month1 = 0;
          }else{
            Year1 = currentYear;
            Month1= currentMonth+1;
          }

          //核心日历加载
          Calendar.loaderDate(currentYear,currentMonth,Year1,Month1);
          //样式加载
          Calendar.styleLoader();
          //事件绑定
          Calendar.dateEvent();
        },
        //日历样式加载
        styleLoader:function() {
          $calendar = $("." + settings.className);
          //总弹出层样式设置
          $calendar.css({
            "background-color": settings.bgColor,
            "width": settings.width,
            "z-index": settings.zIndex,
            "font-size": settings.fontSize + "px"
          });
          $calendar.children('div').css({
            "float": "left",
            "width": "50%"
          });

          Calendar.setLocation();
          //日历顶部样式设置
          var $calHead=$calendar.find(".cal_head"),
              $oper_add=$calendar.find(".month_add"),
              $oper_sub=$calendar.find(".month_sub"),
              $arrow=$calHead.find(".operb"),
              $center=$calendar.find(".cal_center"),
              $ctable=$center.find("table");

          //箭头大小
          //    arrowWidth = 6;

              $calHead.css({
                "padding": settings.paddingNum,
                "background-color":settings.topColor,
                "text-align":'center'
              });
              $oper_sub.css({
                "float":"left"
              });
              $oper_add.css({
                "float":"right"
              });
              $arrow.css({
                "display":"inline-block",
                "color":settings.arrowColor,
                "width":'15px',
                "height":"21px",
                "cursor":"pointer"
              });
              //加载中间表格样式
              $ctable.css({
                "width":"100%"
              });
              //加载中间表格实际宽度

              $ctable.find("td").css({"text-align":"center"});
              $ctable.find("td").css({
                "text-align":"center",
                "width": settings.tdWidth,
                "height": settings.tdHeight,
                "line-height": settings.tdLineH,
                "border":"1px solid "+settings.tdbodercolor
              });
              $ctable.find('.week_head td').css({
                "background-color":settings.tdheadbgcolor
              });
              $ctable.find('.days td').css({
                "background-color":settings.tdbgcolor
              });
              $ctable.find('.days td span').css({
                "color":settings.tdfontcolor
              });
              $ctable.find('.days td .tdTip').css({
                "color":settings.tipcolor
              });
        },
        //设置日历位置
        setLocation:function(){
          $calendar = $("."+settings.className);
          var left = current.offset().left,
              top = current.offset().top + current.innerHeight()+ settings.marginTop;
          $calendar.css({"position":"absolute","left":left,"top":top});
        },
        //日历核心HTML
        innerHTML:function(){
          var htmlContent = {};
          htmlContent = "<div class='prevmonth con'><div class='cal_head'>"+ <!--头部div层start-->
          "<div class='year_oper oper_date'>"+
          "<div class='month_sub operb'><b class='arrow aLeft'><</b></div>"+
          //"<div class='year_add operb'><b class='arrow aRight'>></b></div>"+
          "<span class='current_year'></span>"+
          "<span class='current_month'></span>"+
            <!--位置互换下,考虑到span后面float:right会换行-->
          "</div>"+
          "<div class='month_oper oper_date'>"+
/*          "<div class='month_sub operb'><b class='arrow aLeft'><</b></div>"+
          "<div class='month_add operb'><b class='arrow aRight'>></b></div>"+*/
          "</div>"+
          "</div>"+ <!--头部div层end-->
          "<div class='cal_center'><table cellspacing='0'></table></div>"+
          "</div>";
          htmlContent+="<div class='nextmonth con'><div class='cal_head'>"+ <!--头部div层start-->
          //"<div class='year_oper oper_date'>"+
/*          "<div class='year_sub operb'><b class='arrow aLeft'><</b></div>"+
          "<div class='year_add operb'><b class='arrow aRight'>></b></div>"+*/
          //"<span class='current_year'></span>"+
            <!--位置互换下,考虑到span后面float:right会换行-->
          //"</div>"+
          "<div class='month_oper oper_date'>"+
          //"<div class='month_sub operb'><b class='arrow aLeft'><</b></div>"+
          "<div class='month_add operb'><b class='arrow aRight'>></b></div>"+
          "<span class='current_year'></span>"+
          "<span class='current_month'></span>"+
          "</div>"+
          "</div>"+ <!--头部div层end-->
          "<div class='cal_center'><table cellspacing='0'></table></div>"+
          "</div>";
        /*  "<div class='cal_bottom'>"+ <!--底部div层start-->
          "<button class='clear_date'>清空</button>"+
          "<button class='today_date'>今天</button>"+
          "<button class='confirm_date'>确定</button>"+
          "</div>";<!--底部div层end-->*/
          return htmlContent;
        },
        //事件绑定
        dateEvent:function(){
          var $calendar = $("."+settings.className);
          $calendar.find(".year_add").click(function(){Calendar.monthSub();});
          $calendar.find(".year_sub").click(function(){Calendar.monthSub();});
          $calendar.find(".month_add").click(function(){Calendar.monthAdd();});
          $calendar.find(".month_sub").click(function(){Calendar.monthSub();});
          $calendar.find(".confirm_date").click(function(){Calendar.confirm();});
          $calendar.find(".today_date").click(function(){Calendar.getToday();});
          $calendar.find(".clear_date").click(function(){Calendar.clear();});
        },
        //当前日期:年份和月份
        date:function(){
          var $calendar = $("."+settings.className);
          return {
            year:parseInt($calendar.find(".current_year").html()),
            month:parseInt($calendar.find(".current_month").html())
          };
        },
        //年份自增
        yearAdd:function(){
          Calendar.loaderDate(Calendar.date().year+1,Calendar.date().month-1,Calendar.date().year+1,Calendar.date().month);
        },
        //年份自减
        yearSub:function(){
          Calendar.loaderDate(Calendar.date().year-1,Calendar.date().month-1,Calendar.date().year-1,Calendar.date().month);
        },
        //月份自增
        monthAdd:function(){
          var year=Calendar.date().year, month=Calendar.date().month,year1,month1;
          if(month==11) {
            month=month+1;
            month1=1;
            //year=year+1;
            year1=year+1;
          }
          else if(month==12) {
            month=1;
            month1=2;
            year1=year+1;
            year=year+1;
          }
          else {
             year1=year;
             month=month+1;
             month1=month+1;
          }

          Calendar.loaderDate(year,month-1,year1,month1-1);
        },
        //月份自减
        monthSub:function(){
          var year = Calendar.date().year, month = Calendar.date().month,year1,month1;
          if(month==1) {
            month=12;
            month1=1;
            year1=year;
            year=year-1;
          } else {
            year1=year;
            month1=month;
            month=month-1;
          }

          Calendar.loaderDate(year,month-1,year1,month1-1);
        },
        //日期选择
        dateChoose:function($object){
          var year = Calendar.date().year, month = Calendar.date().month;
          //上一个月
          if($object.hasClass("pre_month_day")) {
            if(month == 1) {
              year = year-1;
              month = 12;
            } else {
              month = (month-1).addZero();
            }
            //当前月
          } else if($object.hasClass("this_month_day")) {
            month = month.addZero();
            //下一个月
          } else {
            if(month == 12) {
              month = "01";
              year = year + 1;
            } else {
              month = (month+1).addZero();
            }
          }
          if($object.children('span').text()!=''&&$object.children('.tdTip').text()!=''){
            current.val(parseInt($object.parents('.con').find(".current_year").html())+"-"+parseInt($object.parents('.con').find(".current_month").html())+"-"+$object.children('span').text());
          }else{
            current.val('');
          }
        },
        //确定事件
        confirm:function(){
          Calendar.destory();
        },
        //是否是闰年
        isLeapYear:function(year){
          if((year%4==0 && year%100!=0) || (year%400==0)) {
            return true;
          }
          return false;
        },
        //指定年份二月的天数
        februaryDays:function(year){
          if(typeof year !== "undefined" && parseInt(year) === year) {
            return Calendar.isLeapYear(year) ? 29:28;
          }
          return false;
        },
        getWeek:function(num){
          return Calendar.weeks[num];
        },
        //获取指定月份[0,11]的天数
        getMonthDay:function(year,month){
          if(month === 1){
            return Calendar.februaryDays(year);
          }
          month=(month===-1)?11:month;

          return Calendar.months[month];
        },
        //今天
        getToday:function(){
          var date = new Date(),
              year = date.getFullYear(),
              month = (date.getMonth()+1).addZero(),
              day = date.getDate().addZero();
          current.val(year+"-"+month+"-"+day);
          Calendar.destory();
        },
        //清空
        clear:function(){
          current.val("");
          Calendar.destory();
        },
        //关闭日历
        destory:function(){
          $("."+settings.className).empty().remove();
        },
        //初始化日历主体内容
        loaderDate:function(year,month,year1,month1){
          //初始化日期为当前年当前月的1号,获取1号对应的星期
          var oneWeek=new Date(year,month,1).getDay(),
              twoWeek=new Date(year1,month1,1).getDay(),

              $calenda= $("."+settings.className),
              $calendaprev = $("."+settings.className+" .prevmonth"),
              $calendanext = $("."+settings.className+" .nextmonth"),
              $calTable = $calenda.find("table"),
              $calTableprev = $calendaprev.find("table"),
              $calTablenext = $calendanext.find("table"),
          //这个月天数
              thisMonthDay = Calendar.getMonthDay(year,month),
              //nextMonthDay = Calendar.getMonthDay(year,month1),

          //下个月天数
              nextMonthDay ,
          //获取上一月的天数
              preMonthDay;
          //清空日期列表

          $calTableprev.html("");
          $calTablenext.html("");

          $calendaprev.find(".current_year").text(year+"年");
          $calendaprev.find(".current_month").text((month+1)+"月");
          $calendanext.find(".current_year").text((year1)+"年");
          $calendanext.find(".current_month").text((month1+1)+"月");
          if(oneWeek == 0) oneWeek = 7;
          if(twoWeek == 0) twoWeek = 7;

          if(month==0) {
            preMonthDay = Calendar.getMonthDay(year-1,11);

          } else {
            preMonthDay = Calendar.getMonthDay(year,month-1);
          }
          if(month1==0) {
            nextMonthDay = Calendar.getMonthDay(year,0);

          } else {
            nextMonthDay = Calendar.getMonthDay(year,month+1);
          }

          var start = 1, end = 1;
          var start1 = 1, end1 = 1;
          var starT = settings.dayInfo.starttime,
              enD = settings.dayInfo.endtime;
          for(var i=0;i<7;i++) {
            var dayHTML = "";
            if(i==0) {
              $calTableprev.append("<tr class='week_head'><tr>");
            }
            for(var j=1;j<=7;j++) {
              //设置星期列表
              if(i==0) {
                $calTableprev.find(".week_head").append("<td>"+Calendar.getWeek(j-1)+"</td>");
              } else {
                if(settings.showOthermonth){
                  if((i-1)*7+j<=oneWeek) { //从第二行开始设置值
                    dayHTML+="<td class=''><span>"+(preMonthDay-oneWeek+j)+"</span></td>";
                  } else if((i-1)*7+j<=thisMonthDay+oneWeek ){
                    var result=(start++).addZero();
                    dayHTML+="<td class='this_month_day'><span>"+result+"</span></td>";
                  } else {
                    var result=(end++).addZero();
                    dayHTML +="<td class=''><span>"+result+"</span></td>";
                  }
                }else{
                  if((i-1)*7+j<=oneWeek) { //从第二行开始设置值
                    dayHTML+="<td><span></span></td>";
                  }
                  else if((i-1)*7+j<=thisMonthDay+oneWeek ){
                    var result=(start++).addZero();
                    // var result = i*7+j-oneWeek+1;
                    dayHTML+="<td class='this_month_day'><span>"+result+"</span></td>";
                  } else{
                    dayHTML+="<td><span></span></td>";
                  }
                }
              }
            }
            if(i>0){
              $calTableprev.append("<tr class='days'>"+dayHTML+"</tr>");
            }
          }
          for(var i=0;i<7;i++) {
            var nextdayHTML = "";
            if(i==0) {
              $calTablenext.append("<tr class='week_head'><tr>");
            }
            for(var j=1;j<=7;j++) {
              //设置星期列表
              if(i==0) {
                $calTablenext.find(".week_head").append("<td>"+Calendar.getWeek(j-1)+"</td>");
              } else {
                if(settings.showOthermonth){
                  if((i-1)*7+j<=twoWeek) { //从第二行开始设置值
                    nextdayHTML+="<td class=''><span>"+(thisMonthDay-twoWeek+j)+"</span></td>";
                  } else if((i-1)*7+j<=nextMonthDay+twoWeek ){
                    var result=(start1++).addZero();
                    nextdayHTML+="<td class='next_month_day'><span>"+result+"</span></td>";
                  } else {
                    var result=(end1++).addZero();
                    nextdayHTML +="<td class=''><span>"+result+"</span></td>";
                  }
                }else{
                  if((i-1)*7+j<=twoWeek) { //从第二行开始设置值
                    nextdayHTML+="<td><span></span></td>";
                  }
                  else if((i-1)*7+j<=nextMonthDay+twoWeek ){
                    var result=(start1++).addZero();
                    // var result = i*7+j-twoWeek+1;
                    nextdayHTML+="<td class='this_month_day'><span>"+result+"</span></td>";
                  } else{
                    nextdayHTML+="<td><span></span></td>";
                  }
                }
              }
            }
            if(i>0){
              $calTablenext.append("<tr class='days'>"+nextdayHTML+"</tr>");
            }
          }
          $calTableprev.find('tr[class!=week_head] td').each(function(v,k){
            if(starT<=new Date(year,month,$(k).text())&&enD>=new Date(year,month,$(k).text())&&$(k).text()!=''){
              $(k).append('<div class="tdTip">'+settings.dayInfo.price+'</div>');
              settings.operate("sd");

            }
          }); $calTablenext.find('tr[class!=week_head] td').each(function(v,k){
            if(starT<=new Date(year1,month1,$(k).text())&&enD>=new Date(year1,month1,$(k).text())&&$(k).text()!=''){
              $(k).append('<div class="tdTip">'+settings.dayInfo.price+'</div>');
              settings.operate("sd");

            }
          });
          Calendar.tableStyle();
        },
        //表格样式初始化
        tableStyle:function(){
          //表格中单元格的宽度
          var $center = $calendar.find(".cal_center"),
              $calTable = $calendar.find("table"),
              tdWidth = parseFloat($center.width())/7;

          $calTable.find("td").css({
            "cursor":"pointer",
            "text-align":"center",
            "width": settings.tdWidth,
            "height": settings.tdHeight,
            "line-height": settings.tdLineH,
            "border":"1px solid "+settings.tdbodercolor
     /*       "width":tdWidth,
            "text-align":"center",*/
            //"color":"#AFAFAF",
            //"background":settings.thisMonthBgColor,

            //"color":settings.thisMonthFontColor,
            //"border-top":settings.tableBorder,
            //"border-right":settings.tableBorder
          });
          $calTable.find(".week_head td").css({
            "background":settings.tdheadbgcolor,
            "cursor":"auto"
          });
         /* $calTable.find(".pre_month_day,.next_month_day").css({
            "color":settings.noThisMonthFontColor,
            "background":"transparent"
          });*/
          //去除最右侧表格的右边框
          //$calTable.find("td:nth-child(7n)").css({"border-right":0});
          $calTable.find("tr[class!=week_head] td").hover(function(){
            $(this).css({
              "background":settings.dateHoverBgColor
            });
            $(this).find("span").css({
              "color":settings.dateHoverFontColor
            });
          },function(){
            $(this).css({"background":settings.tdbgcolor});
            $(this).find("span").css({"color":settings.tdfontcolor});
          }).click(function(){Calendar.dateChoose($(this));});
     /*    $calTable.find('.days td span').css({
            "color":settings.tdfontcolor
          });*/
          $calTable.find('.days td .tdTip').css({
            "color":settings.tipcolor
          });
        }
      };

      return this.each(function(){
        $target.click(function(){
          //触发对象,请写在点击事件中,不然会做为全局变量!
          current = $(this);
          //如果没有生成日历元素
          if($("."+settings.className).length == 0) {
            Calendar.loadCalendar();
          }
        });
        //事件触发对象
        $(document).click(function(event){
          var $calendar = $("."+settings.className)
          if(!$target.triggerTarget(event) && !$calendar.triggerTarget(event)) {
            Calendar.destory();
          }
        });
      });
    },
    //触发事件是否是对象本身
    triggerTarget:function(event){
      //如果触发的是事件本身或者对象内的元素
      return $(this).is(event.target) || $(this).has(event.target).length > 0;
    }
  })
})(jQuery);