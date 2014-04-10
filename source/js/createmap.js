define(['settings', 'lib/news_special/bootstrap', 'lib/vendors/d3-3.4.5', 'lib/vendors/topojson-1.6.6'], function (settings, news, d3, topojson) {

	var init = function () {
		// removes fallback image
		if (viewportIsWideEnough() && svgIsSupported()) {
			news.$('#container .fallback').remove();

			// creates SVG element with properties from settings file
			d3.select('#container').append('svg').attr({
				'id' : 'map',
				'width' : settings.width['main'],
				'height' : settings.height['main']
			});

			drawMap('england');
			drawMap('london');
			exitLoadingMode();
		}
	};

	/*
	* Checks SVG support
	*/
	var svgIsSupported = function () {

		return (!!document.createElementNS) && (!!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

	};

	/*
	* Checks viewport width
	*/
	var viewportIsWideEnough = function () {
		// using innerWidth because we're testing width of the iframe

		return window.innerWidth > 600;

	};

	/*
	* Gets corresponding projection from settings file
	*/
	var getPath = function (map) {
		return d3.geo.path().projection(settings.projections[map]);
	};

	/*
	* Gets corresponding topoJSON features from settings file
	*/
	var getTopoFeatures = function (map) {
		var mapPointer = settings.maps[map];

		return topojson.feature(mapPointer, mapPointer.objects.boundaries);
	};

	/*
	* Creates D3 map
	*/
	var drawMap = function (map) {
		var svg = d3.select('svg#map'),
			topo = getTopoFeatures(map),
			path = getPath(map);

		svg.append('g').attr('class', map)
			.selectAll('path')
			.data(topo.features)
			.enter().append('path')
			.attr('d', path)
			.attr('fill', function (e) {
				var percentage = e.properties.PTREADWRIT * 100;
				return pickColor(percentage, '1');
			})
			.style('stroke', '#777')
			.style('cursor', 'pointer')
			.on('mousemove', function (e) {
				handleMouseOver(this, e);
			})
			.on('mouseout', function (e) {
				handleMouseOut(this, e);
			});
	};

	/*
	* Colours area and shows tooltip
	*/
	var handleMouseOver = function (that, e) {
		var percentage = e.properties.PTREADWRIT * 100;
		d3.select(that).style('fill', pickColor(percentage, '.45'));
		showTooltip(e, map);
	};

	/*
	* Colours back area and hides tooltip
	*/
	var handleMouseOut = function (that, e) {
		var percentage = e.properties.PTREADWRIT * 100;
		d3.select(that).style('fill', pickColor(percentage, '1'));
		d3.select('#tooltip').style({'display' : 'none'});
	};

	/*
	* Selects a color according to the value represented
	*/
	var pickColor = function (value, opacity) {
		var color = '',
			rgb = '';

		value = Math.round(value);

		if (value >= 72) {
			rgb = '255, 187, 51';
		} else if (value >= 68) {
			rgb = '255, 204, 102';
		} else if (value >= 63) {
			rgb = '255, 238, 204';
		} else if (value >= 58) {
			rgb = '153, 187, 204';
		} else {
			rgb = '51, 102, 153';
		}

		color = 'rgba(' + rgb + ', ' + opacity + ')';

		return color;
	};

	/*
	* Updates and repositions tooltip
	*/
	var showTooltip = function (d, map) {
		var name = d.properties.SCHNAME,
			percentage = Math.round(d.properties.PTREADWRIT * 100),
			tipText = '<strong>' + name + '</strong> (' + percentage + '%)',
			tooltipWidthOffset,
			tooltipTopOffset = settings.offsets['tooltipTop'],
			left,
			top,
			mapContainer = document.getElementById('map');

		d3.select('#tooltip').html(tipText);
		tooltipWidthOffset = parseInt(d3.select('#tooltip').style('width'), 10) / 2;
		left = d3.event.pageX - mapContainer.offsetLeft - tooltipWidthOffset;
		top = d3.event.pageY - mapContainer.offsetTop + tooltipTopOffset;
		d3.select('#tooltip').style({'left' : left + 'px', 'top' : top + 'px', 'display' : 'block'});
	};

	/*
	* Removes spinner
	*/
	var exitLoadingMode = function () {
		news.$('.spinner').removeClass('spinner');
	};

    return {
        init: function () {
			init();
        }
    };

});