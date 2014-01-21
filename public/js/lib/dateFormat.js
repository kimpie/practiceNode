/*! jquery-dateFormat 10-01-2014 */
var DateFormat={};!function(a){var b=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],d=["January","February","March","April","May","June","July","August","September","October","November","December"],e={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"},f=/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;a.format=function(){function a(a){return b[parseInt(a,10)]||a}function g(a){var b=parseInt(a,10)-1;return c[b]||a}function h(a){var b=parseInt(a,10)-1;return d[b]||a}function i(a){return e[a]||a}function j(a){var b,c,d,e,f,g=a,h="";return-1!==g.indexOf(".")&&(e=g.split("."),g=e[0],h=e[1]),f=g.split(":"),3===f.length?(b=f[0],c=f[1],d=f[2].replace(/\s.+/,"").replace(/[a-z]/gi,""),g=g.replace(/\s.+/,"").replace(/[a-z]/gi,""),{time:g,hour:b,minute:c,second:d,millis:h}):{time:"",hour:"",minute:"",second:"",millis:""}}function k(a,b){for(var c=b-String(a).length,d=0;c>d;d++)a="0"+a;return a}return{parseDate:function(a){var b={date:null,year:null,month:null,dayOfMonth:null,dayOfWeek:null,time:null};if("number"==typeof a)return this.parseDate(new Date(a));if("function"==typeof a.getFullYear)b.year=String(a.getFullYear()),b.month=String(a.getMonth()+1),b.dayOfMonth=String(a.getDate()),b.time=j(a.toTimeString());else if(-1!=a.search(f))values=a.split(/[T\+-]/),b.year=values[0],b.month=values[1],b.dayOfMonth=values[2],b.time=j(values[3].split(".")[0]);else switch(values=a.split(" "),values.length){case 6:b.year=values[5],b.month=i(values[1]),b.dayOfMonth=values[2],b.time=j(values[3]);break;case 2:subValues=values[0].split("-"),b.year=subValues[0],b.month=subValues[1],b.dayOfMonth=subValues[2],b.time=j(values[1]);break;case 7:case 9:case 10:b.year=values[3],b.month=i(values[1]),b.dayOfMonth=values[2],b.time=j(values[4]);break;case 1:subValues=values[0].split(""),b.year=subValues[0]+subValues[1]+subValues[2]+subValues[3],b.month=subValues[5]+subValues[6],b.dayOfMonth=subValues[8]+subValues[9],b.time=j(subValues[13]+subValues[14]+subValues[15]+subValues[16]+subValues[17]+subValues[18]+subValues[19]+subValues[20]);break;default:return null}return b.date=new Date(b.year,b.month-1,b.dayOfMonth),b.dayOfWeek=String(b.date.getDay()),b},date:function(b,c){try{var d=this.parseDate(b);if(null===d)return b;for(var e=(d.date,d.year),f=d.month,i=d.dayOfMonth,j=d.dayOfWeek,l=d.time,m="",n="",o="",p=!1,q=0;q<c.length;q++){var r=c.charAt(q),s=c.charAt(q+1);if(p)"'"==r?(n+=""===m?"'":m,m="",p=!1):m+=r;else switch(m+=r,o="",m){case"ddd":n+=a(j),m="";break;case"dd":if("d"===s)break;n+=k(i,2),m="";break;case"d":if("d"===s)break;n+=parseInt(i,10),m="";break;case"D":i=1==i||21==i||31==i?parseInt(i,10)+"st":2==i||22==i?parseInt(i,10)+"nd":3==i||23==i?parseInt(i,10)+"rd":parseInt(i,10)+"th",n+=i,m="";break;case"MMMM":n+=h(f),m="";break;case"MMM":if("M"===s)break;n+=g(f),m="";break;case"MM":if("M"===s)break;n+=k(f,2),m="";break;case"M":if("M"===s)break;n+=parseInt(f,10),m="";break;case"y":case"yyy":if("y"===s)break;n+=m,m="";break;case"yy":if("y"===s)break;n+=String(e).slice(-2),m="";break;case"yyyy":n+=e,m="";break;case"HH":n+=k(l.hour,2),m="";break;case"H":if("H"===s)break;n+=parseInt(l.hour,10),m="";break;case"hh":hour=0===parseInt(l.hour,10)?12:l.hour<13?l.hour:l.hour-12,n+=k(hour,2),m="";break;case"h":if("h"===s)break;hour=0===parseInt(l.hour,10)?12:l.hour<13?l.hour:l.hour-12,n+=parseInt(hour,10),m="";break;case"mm":n+=k(l.minute,2),m="";break;case"m":if("m"===s)break;n+=l.minute,m="";break;case"ss":n+=k(l.second.substring(0,2),2),m="";break;case"s":if("s"===s)break;n+=l.second,m="";break;case"S":case"SS":if("S"===s)break;n+=m,m="";break;case"SSS":n+=l.millis.substring(0,3),m="";break;case"a":n+=l.hour>=12?"PM":"AM",m="";break;case"p":n+=l.hour>=12?"p.m.":"a.m.",m="";break;case"'":m="",p=!0;break;default:n+=r,m=""}}return n+=o}catch(t){return console&&console.log&&console.log(t),b}},prettyDate:function(a){var b,c,d;return("string"==typeof a||"number"==typeof a)&&(b=new Date(a)),"object"==typeof a&&(b=new Date(a.toString())),c=((new Date).getTime()-b.getTime())/1e3,d=Math.floor(c/86400),isNaN(d)||0>d?void 0:60>c?"just now":120>c?"1 minute ago":3600>c?Math.floor(c/60)+" minutes ago":7200>c?"1 hour ago":86400>c?Math.floor(c/3600)+" hours ago":1===d?"Yesterday":7>d?d+" days ago":31>d?Math.ceil(d/7)+" weeks ago":d>=31?"more than 5 weeks ago":void 0},toBrowserTimeZone:function(a,b){return this.date(new Date(a),b||"MM/dd/yyyy HH:mm:ss")}}}()}(DateFormat),function(a){a.format=DateFormat.format}(jQuery);