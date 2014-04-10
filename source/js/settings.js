define(['lib/vendors/d3-3.4.5', 'maps/england_topojson', 'maps/london_topojson'], function (d3, englandMap, londonMap) {
	var maps = {
			england : englandMap,
			london : londonMap
		},
		width = {
			main : 600
		},
		height = {
			main : 600
		},
		projections = {
			england : d3.geo.conicEqualArea()
				.scale(5000)
				.center([-3.155780527429952, 54.31705211263513])
				.parallels([49.8865552756808, 59.393848915007354])
				.rotate([2.555780527429952])
				.translate([140, 180]),
			london : d3.geo.conicEqualArea()
				.scale(20595)
				.center([-1.5831937696417774, 52.132867635201136])
				.parallels([49.887161769856654, 55.811699768042466])
				.rotate([1.7831937696417774])
				.translate([-605, 105])
		},
		offsets = {
			tooltipTop : 42
		};

	return {
		maps : maps,
		width : width,
		height : height,
		projections : projections,
		offsets : offsets
	};
});