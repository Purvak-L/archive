$(function(){
    // for sample 1
    $('#cropbox1').Jcrop({ // we linking Jcrop to our image with id=cropbox1
        aspectRatio: 0,
        onChange: updateCoords,
        onSelect: updateCoords
    });
});

function updateCoords(c) {
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
    $('#x2').val(c.x2);
    $('#y2').val(c.y2);
    var rx = 200 / c.w; // 200 - preview box size
    var ry = 200 / c.h;
	
	console.log("TEST");
	console.log(c.x+":"+c.y+":"+c.x2+":"+c.y2);
    document.getElementById("latest_coordinates").innerHTML = "<br>Located Co-ordinates: "+c.x+":"+c.y+":"+c.x2+":"+c.y2;
	
};

// jQuery(window).load(function(){
//     $("#accordion").accordion({autoHeight: false,navigation: true});
// });

function checkCoords() {
    if (parseInt($('#w').val())) return true;
    alert('Please select a crop region then press submit.');
    return false;
};