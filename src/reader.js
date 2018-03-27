
var drone_stats_str = '';
var curr_level = -1; 

set_drone_data_flag = 0;
set_grid_data_flag = 0;

var disp;
var dispCtx;
var im;
var ws;

var drone_loc = { 
	"type": "drones",
	"drones": [
		{"id": "1101", "est_loc": [12.1234,11.5678,1], "conn_status": "connected", "timestamp": "020439" },
		{"id": "1102", "est_loc": [8.1234,14.5678,1], "conn_status": "connected", "timestamp": "074518" },
		{"id": "1103", "est_loc": [9.1234,10.5678,1], "conn_status": "not_connected", "timestamp": "032338" },
		{"id": "1104", "est_loc": [4.1234,11.5678,1], "conn_status": "connected", "timestamp": "032338" }	
	]
};
// console.log(drone_loc);
function send_params() {
	console.log('entered send_params');
	height = document.getElementById("height").value;
	overlap = document.getElementById("overlap").value;
	no_drones = document.getElementById("no_drones").value;
	comm_range = document.getElementById("comm_range").value;
	server_range = document.getElementById("server_range").value;

	var sim_params = {
	"type": "sim_params",
	"level": curr_level,
	"height": height,
	"overlap": overlap,
	"swarm" : [no_drones,comm_range,server_range] }

	console.log(sim_params);

	ws2 = new WebSocket("ws://127.0.0.1:50008");
	ws2.onopen = () => ws2.send(JSON.stringify(sim_params));
	// console.log(overlap,no_drones);
	// return false;
	// TODO: send data to server    
}

function set_level(number) {
	console.log(number);
	curr_level = number;
}

function doLoad() {
	if (location.href.split("/").slice(-1) == "index.html") {
			disp = document.getElementById("main-image");
    		dispCtx = disp.getContext("2d");
    		im = new Image();
    		// console.log("doload");
    		im.onload = function() {
    		disp.setAttribute("width", im.width);
    		disp.setAttribute("height", im.height);
    		dispCtx.drawImage(this, 0, 0);
  		};	
	} 
    
    // im.src = "img/img_not_found.png";
    ws = new WebSocket("ws://127.0.0.1:50008");
    ws.onmessage = function (evt) {
    	// console.log(evt.data);
    	data = JSON.parse(evt.data);
    	// console.log(data["type"]);
    	// console.log(data.type);

    	// to handle drone status data (e.g. for main page table)
    	if (data.type == "drones") {
    		console.log(data);
    		if (location.href.split("/").slice(-1) == "index.html") {
    			setDroneTableData(data);
    			set_drone_data_flag = 1;
    		}
    	}
    	// to handle image data 
    	else if (data.type == "bg-img") {
    		// console.log('img data received');
    		console.log(data);
    		if (location.href.split("/").slice(-1) == "index.html") {
    			im.src = "data:image/png;base64," + data.img_data;
    		}
    	}
    	// to handle relay points data
    	else if (data.type == "relay") {
    		console.log(data);
    	} 

    	// to handle grid data
    	else if (data.type == "grid_data") {
    		setGridTableData(data);
    		console.log(data);
    	}
        // im.src = "data:image/png;base64," + evt.data;
        // console.log("data:image/png;base64," + evt.data);
    }
    //ws.close();
}

function setDroneTableData(data) {
	if (set_drone_data_flag == 0) {
		for (var i = data.drones.length - 1; i >= 0; i--) {
		id = "#"+data.drones[i].id;
		lat = data.drones[i].est_loc[0];
		lng = data.drones[i].est_loc[1];
		conn = data.drones[i].conn_status;
		ts = data.drones[i].timestamp;
		if (conn == "connected") {
			temp_str = "<tr><td class=\"fw-600\">" + id + "</td><td><span class=\"badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill\">" + conn + "</span></td><td>(" + lat + "," + lng + ")</td><td>" + ts + "</td></tr>";		
		}
		else {
			temp_str = "<tr><td class=\"fw-600\">" + id + "</td><td><span class=\"badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill\">" + conn + "</span></td><td>(" + lat + "," + lng + ")</td><td>" + ts + "</td></tr>";		
		}
		drone_stats_str += temp_str;
	}
	document.getElementById("drone_stats").innerHTML = drone_stats_str;
	}
	
}

function setGridTableData(data) {
	grid_data_str = '';
		for (var i = data.blocks.length - 1; i >= 0; i--) {
			
			grid_id = "#"+data.blocks[i].id;
			grid_label = data.blocks[i].label;
			centre_x = data.blocks[i].centre[0];
			centre_y = data.blocks[i].centre[1];
			centre_z = data.blocks[i].centre[2];
			grid_status = data.blocks[i].status;
			associated_drone_id = "#"+data.blocks[i].drone_id;
			est_time = data.blocks[i].est_time;
			if (grid_status == "explored") {
				temp_str = "<tr><td>"+grid_id+"</td><td>"+grid_label+"</td><td>["+centre_x+", "+centre_y+", "+centre_z+"]</td><td><span class=\"badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill\">"+grid_status+"</span></td><td>"+associated_drone_id+"</td><td>"+est_time+"</td></tr>";
			}
			else {
				temp_str = "<tr><td>"+grid_id+"</td><td>"+grid_label+"</td><td>["+centre_x+", "+centre_y+", "+centre_z+"]</td><td><span class=\"badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill\">"+grid_status+"</span></td><td>"+associated_drone_id+"</td><td>"+est_time+"</td></tr>";
			}
			grid_data_str += temp_str;
		}
	document.getElementById("grid_table_body").innerHTML = grid_data_str;
}

// if (drone_loc.type == "drones") {
// 	for (var i = drone_loc.drones.length - 1; i >= 0; i--) {
// 		// console.log(drone_loc.drones[i].id);
// 		// console.log(drone_loc.drones[i].est_loc[1]);
// 		// console.log(drone_loc.drones[i].conn_status);
// 		// console.log(drone_loc.drones[i].timestamp);
// 		id = drone_loc.drones[i].id;
// 		lat = drone_loc.drones[i].est_loc[0];
// 		lng = drone_loc.drones[i].est_loc[1];
// 		conn = drone_loc.drones[i].conn_status;
// 		ts = drone_loc.drones[i].timestamp;
// 		if (conn == "connected") {
// 			temp_str = "<tr><td class=\"fw-600\">" + id + "</td><td><span class=\"badge bgc-green-50 c-green-700 p-10 lh-0 tt-c badge-pill\">" + conn + "</span></td><td>(" + lat + "," + lng + ")</td><td>" + ts + "</td></tr>";		
// 		}
// 		else {
// 			temp_str = "<tr><td class=\"fw-600\">" + id + "</td><td><span class=\"badge bgc-red-50 c-red-700 p-10 lh-0 tt-c badge-pill\">" + conn + "</span></td><td>(" + lat + "," + lng + ")</td><td>" + ts + "</td></tr>";		
// 		}
// 		drone_stats_str += temp_str;
// 		// console.log(drone_stats_str);
// 	}

// }
// // console.log(drone_stats_str);
// document.getElementById("drone_stats").innerHTML = drone_stats_str;
// console.log(curr_level);




				

