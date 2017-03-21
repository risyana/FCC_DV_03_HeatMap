$("document").ready(function(){

	var arrMonth = [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
					];

	var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json';
	var arrData = [];
	var baseTemp = 0;

	var svgWidth = 1000;
	var svgHeight = 400;



	$.getJSON(url,function(result){
		arrData = result.monthlyVariance;
		baseTemp = result.baseTemperature;

		console.log(arrData);
		console.log(baseTemp);

		// SCALE & AXIS X
		var xDomainMin = d3.min(arrData,function(val,idx){
			return arrData[idx].year;
		});
		
		var xDomainMax = d3.max(arrData,function(val,idx){
			return arrData[idx].year;
		});

		var xScale = d3.scale.linear()
		.domain([xDomainMin,xDomainMax])
		.range([0,svgWidth]);

		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(10);

		// SCALE & AXIS Y
		var yDomainMin = d3.min(arrData,function(val,idx){
			return arrData[idx].month;
		});
		
		var yDomainMax = d3.max(arrData,function(val,idx){
			return arrData[idx].month;
		});

		var yScale = d3.scale.linear()
		.domain([yDomainMin,yDomainMax])
		.range([0,svgHeight]);

		var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(12)
		.tickFormat(function(val){
			return arrMonth[val-1];
		});


		//DRAW SVG
		var svg = d3.select("body")
		.append("svg")
		.attr("width",svgWidth+"px")
		.attr("height",svgHeight+"px");

		// DRAW AXIS X
		svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(0,"+(svgHeight)+")")
		.call(xAxis);

		// DRAW AXIS Y
		svg.append("g")
		.attr("class","axis")
		.attr("transform","translate(0,0)")
		.call(yAxis);


		// DRAW RECTS

		var rectWidth = svgWidth/(xDomainMax-xDomainMin);
		var rectHeight = svgHeight/arrMonth.length;
		console.log("rectWidth: "+rectWidth);
		console.log("rectHeight: "+rectHeight);

		svg.selectAll("rect")
		.data(arrData)
		.enter()
		.append("rect")
		.attr("id",function(val,idx){
			return idx;
		})
		.attr("fill",function(val,idx){
			return "rgb(232, "+ (155 - Math.floor(arrData[idx].variance * 50)) +", 65)"
		})
		.attr("x",function(val,idx){
			return (arrData[idx].year - xDomainMin) * rectWidth;
		})
		.attr("y",function(val,idx){
			return (arrData[idx].month * rectHeight) - rectHeight;
		})
		.attr("width",rectWidth)
		.attr("height",rectHeight);

		// TOOLTIP
		$("rect").mouseover(function(e){
			$(".tooltip").css("visibility","visible");
			$(".tooltip").css("left",e.clientX+10+"px");
			$(".tooltip").css("top",e.clientY+10+"px");

			$(".tt_year").html(+arrData[$(this).attr("id")].year);
			$(".tt_month").html(arrMonth[arrData[$(this).attr("id")].month - 1]);
			$(".tt_variance").html(arrData[$(this).attr("id")].variance);
			$(".tt_temp").html( baseTemp - arrData[$(this).attr("id")].variance);

		});

		$("rect").mouseout(function(){
			$(".tooltip").css("visibility","hidden");
		});


	}); // end getJSON

	

}); // end jquery 