function Photo(id, tags, orientation, numtags) {
    this.id = id;
    this.tags = tags;
    this.orientation = orientation;
    this.numtags = numtags;
}

function Slide(photos) {
    this.photos = photos;
}

var photos = []; 
var slideshow = [];

window.onload = function() {
    alles();
}


function alles() {

    $.get('b_lovely_landscapes.txt', function(data) {
        console.log(data);

        var lines = (data.split("\n")).slice(1);
        
        // kleiner maken
        lines.slice(lines.length/10)
        
        // get the lines
        $.each(lines, function(n, line) {
            
            // split on space
            var parts = line.split(" ");
            var photo = new Photo(n, parts.slice(2), parts[0], parts[1]);

            photos.push(photo);

        });

        doOtherThings();

    }, "text");
}

function doOtherThings(){
    console.log(photos);
}