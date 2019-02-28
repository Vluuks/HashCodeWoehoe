function Photo(id, tags, orientation, numTags) {
    this.id = id;
    this.tags = tags;
    this.orientation = orientation;
    this.numTags = numTags;
}

function Slide(id, photos, tagCount, tags) {
    this.id = id;
    this.photos = photos;
    this.tagcount = tagCount;
    this.tags = tags;
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
        lines = lines.slice(79900)
        
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


// sort by amount of tags 


// comparetags and give similarity score
function compareTags(tags1, tags2) {

    var matchcount;
    $.each(tags1, function(n, tag) {
        if(tags2.includes(tag)) {
            matchount++;
        }
    });
    return matchcount;

}

function sortByNumTags(photoarray) {
    photoarray.sort((a,b) => (a.numTags > b.numTags) ? 1 : ((b.numTags > a.numTags) ? -1 : 0));
}

