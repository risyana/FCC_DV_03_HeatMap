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

		xScaleAdj = 0;
		var xScale = d3.scale.linear()
		.domain([xDomainMin,xDomainMax-xScaleAdj])
		.range([0,svgWidth-xScaleAdj]);

		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(17)
		.tickFormat(function(val,idx){
			return val.toString();
		});

		// SCALE & AXIS Y
		var yDomainMin = d3.min(arrData,function(val,idx){
			return arrData[idx].month;
		});
		
		var yDomainMax = d3.max(arrData,function(val,idx){
			return arrData[idx].month;
		});

		var yScaleAdj = 18;
		var yScale = d3.scale.linear()
		.domain([yDomainMin,yDomainMax])
		.range([0+yScaleAdj,svgHeight-yScaleAdj]);

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
		.style("font-size","12px")
		.attr("transform","translate(0,"+(svgHeight)+")")
		.call(xAxis);

		// DRAW AXIS Y
		svg.append("g")
		.attr("class","axis")
		.style("font-size","12px")
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
			return "rgb(121, "+ (83 - Math.floor(arrData[idx].variance * 30)) +", 45)"
		})
		.attr("x",function(val,idx){
			return (arrData[idx].year - xDomainMin) * rectWidth;
		})
		.attr("y",function(val,idx){
			return (arrData[idx].month * rectHeight) - rectHeight;
		})
		.attr("height",0)			//animation
		.transition()				//animation
		.duration(2)				//animation
		.delay(function(val,idx){	//animation
			return idx * 1;			//animation
		})							//animation
		.attr("height",rectHeight)	//animation
		.attr("width",rectWidth);

		// DRAW TITLE
		svg.append("text")
		.attr("x",svgWidth/2)
		.attr("y",-20)
		.attr("text-anchor","middle")
		.style("font-size","25px")
		.style("font-weight","bold")
		.text("Monthly Land Surface Temperature (1753 - 2015)");

		//add Y axis note
		svg.append("text")
		.attr("x",-(svgHeight)/2)
		.attr("y",-60)
		.attr("text-anchor","middle")
		.style("font-weight","bold")
		.style("transform","rotate(270deg")
		.style("font-size","15px")
		.text("Month");
		
		//add x axis note
		svg.append("text")
		.attr("x",svgWidth/2)
		.attr("y",(svgHeight)+40)
		.style("font-weight","bold")
		.attr("text-anchor","middle")
		.style("font-size","15px")
		.text("Year");

		// TOOLTIP
		$("rect").mouseover(function(e){
			$(".tooltip").css("visibility","visible");
			$(".tooltip").css("left",e.clientX+10+"px");
			$(".tooltip").css("top",e.clientY+10+"px");

			$(".tt_year").html(+arrData[$(this).attr("id")].year);
			$(".tt_month").html(arrMonth[arrData[$(this).attr("id")].month - 1]);
			$(".tt_variance").html(arrData[$(this).attr("id")].variance.toFixed(3));
			$(".tt_temp").html( (baseTemp + arrData[$(this).attr("id")].variance).toFixed(3));

		});

		$("rect").mouseout(function(){
			$(".tooltip").css("visibility","hidden");
		});


	}); // end getJSON

	

}); // end jquery 