$(document).ready(function(){
	allAreasRate();
});


var myChart;
function allAreasRate(){
 // Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径  
	require.config({
        paths: {
        	echarts: '../lib/echarts'
        }
    });
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径 
    require(
        [
         //这里的'echarts'相当于'./js' 
            'echarts',         
            'echarts/chart/bar'
          
        ],
      //创建ECharts图表方法 
        function (ec) {
        	//--- 折柱 ---  
        	//自适应宽高
            var myChartContainer = function () {
                $("#yxChart").css({"width":window.innerWidth + "px"});
                $("#yxChart").css({"height":window.innerHeight - 31 + "px"});
            };
            myChartContainer();
            //基于准备好的dom,初始化echart图表  
            myChart = ec.init(document.getElementById('yxChart')); 
            
            var option1 = {
            	    title : {
            	        text: '越限统计信息',
            	        subtext: '数据展示'
            	    },
            	    tooltip : {
            	        trigger: 'axis'
            	    },
            	    calculable : true,
            	    xAxis : [
            	        {
            	            type : 'category',
            	            //data:['开断总数','越限总数','线路越限数','变压器越限数','发电机越限数','xxx越限数']
            	            data:['基态方式','线路N-1扫描','变压器N-1扫描','发电机N-1扫描','母线N-1扫描','自定义故障N-1扫描']
            	        }
            	    ],
            	    yAxis : [
            	        {
            	            type : 'value'
            	        }
            	    ],
            	    series : [
            	        {
            	            name:'开断总数',
            	            type:'bar',
            	            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7],
            	            markPoint : {
            	                data : [
            	                    {type : 'max', name: '最大值'},
            	                    {type : 'min', name: '最小值'}
            	                ]
            	            }
            	        },
            	        {
            	            name:'越限总数',
            	            type:'bar',
            	            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7],
            	            markPoint : {
            	                data : [
            	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
            	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            	                ]
            	            }
            	        },
            	        {
            	            name:'线路越限数',
            	            type:'bar',
            	            data:[12.6, 15.9, 19.0, 36.4, 28.7, 70.7],
            	            markPoint : {
            	                data : [
            	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
            	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            	                ]
            	            }
            	        },
            	        {
            	            name:'变压器越限数',
            	            type:'bar',
            	            data:[42.6, 65.9, 19.0, 36.4, 28.7, 70.7],
            	            markPoint : {
            	                data : [
            	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
            	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            	                ]
            	            }
            	        },
            	        {
            	            name:'发电机越限数',
            	            type:'bar',
            	            data:[82.6, 15.9, 79.0, 36.4, 38.7, 60.7],
            	            markPoint : {
            	                data : [
            	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
            	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            	                ]
            	            }
            	        },
            	        {
            	            name:'xxx越限数',
            	            type:'bar',
            	            data:[52.6, 25.9, 89.0, 46.4, 78.7, 60.7],
            	            markPoint : {
            	                data : [
            	                    {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
            	                    {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            	                ]
            	            }
            	        }
            	    ]
            	};
              
            myChart.setOption(option1);
            $(window).resize(function(){
	           	 myChartContainer();
	           	 myChart.resize();
            });
            //GetEliData();
        }
        
     );
}

function GetEliData()
{
	//console.info(myChart);
	var option = myChart.getOption();
	var serverIP=location.protocol+"//"+location.hostname+":"+location.port+"/";
	$.ajax({
		type : "post",
		url : serverIP+"/osp/pas/rest/rtneteli/getAllAreasRate",
		data : {},
		dataType : "json", //返回数据形式为json
		success : function(result) {
		if (result) {
			if (typeof (result.resultValue.items) == "undefined")
			{
			  return ;
			}
			
			//var arry=["南京","镇江","苏州","无锡","常州"];
			var arry = [];
			var arrydata = [];
			var datas = result.resultValue.items;
			if(datas!=null && datas.length !=0){
				for ( var int = 0; int < datas.length; int++) {
					arry.push(datas[int].name=='null' ? "华东":datas[int].name);
					arrydata.push(returnFloat(Number(datas[int].eli_rate))=='null' ? "0":returnFloat(Number(datas[int].eli_rate)));
				}
				option.series[0].data = arrydata;
				option.xAxis[0].data = arry;
				myChart.setOption(option,true);	
			}
	     }
     },
     error : function(errorMsg) {
			alert("各地区合格率页请求数据失败!");
		}
	});
}


function returnFloat(value) {
	var value = Math.round(parseFloat(value) * 100) / 100;
	var xsd = value.toString().split(".");
	if (xsd.length == 1) {
		value = value.toString() + ".00";
		return value;
	}
	if (xsd.length > 1) {
		if (xsd[1].length < 2) {
			value = value.toString() + "0";
		}
		return value;
	}
}
