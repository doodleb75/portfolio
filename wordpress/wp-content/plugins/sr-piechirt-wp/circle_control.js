var colors = [
			['#D3B6C6', '#e83a93'], ['#FCE6A4', '#EFB917'], ['#BEE3F7', '#45AEEA'], ['#F8F9B6', '#D2D558'], ['#F4BCBF', '#D43A43']
		];

		for (var i = 1; i <= 1; i++) {
			var child = document.getElementById('circles-' + i),
				percentage =85+ (i * 9);
				
			Circles.create({
				id:         child.id,
				percentage: percentage,
				radius:     50,
				width:      50,
				number:   	percentage,
				text:       '%',
				colors:     colors[i-1]
			});
		}
		
		for (var i = 2; i <= 2; i++) {
			var child = document.getElementById('circles-' + i),
				percentage = 80+ (i * 4);
				
			Circles.create({
				id:         child.id,
				percentage: percentage,
				radius:     50,
				width:      50,
				number:   	percentage + 10,
				text:       '%',
				colors:     colors[i - 1]
			});
		}
		
		
		for (var i = 3; i <= 3; i++) {
			var child = document.getElementById('circles-' + i),
				percentage = 70 + (i * 5);
				
			Circles.create({
				id:         child.id,
				percentage: percentage,
				radius:     50,
				width:      50,
				number:   	percentage + 10,
				text:       '%',
				colors:     colors[i - 1]
			});
		}
		
		for (var i = 4; i <= 4; i++) {
			var child = document.getElementById('circles-' + i),
				percentage = 31 + (i * 9);
				
			Circles.create({
				id:         child.id,
				percentage: percentage,
				radius:     50,
				width:      50,
				number:   	percentage + 10,
				text:       '%',
				colors:     colors[i - 1]
			});
		}
		
		for (var i = 5; i <= 5; i++) {
			var child = document.getElementById('circles-' + i),
				percentage = 41 + (i * 9);
				
			Circles.create({
				id:         child.id,
				percentage: percentage,
				radius:     50,
				width:      50,
				number:   	percentage + 10,
				text:       '%',
				colors:     colors[i - 1]
			});
		}
		
		for (var i = 6; i <= 6; i++) {
			var child = document.getElementById('circles-' + i),
				percentage = 31 + (i * 9);
				
			Circles.create({
				id:         child.id,
				percentage: percentage,
				radius:     50,
				width:      50,
				number:   	percentage + 10,
				text:       '%',
				colors:     colors[i - 1]
			});
		}