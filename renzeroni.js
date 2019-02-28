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

var photosHorizontal = [];
var photosVertical = [];
var slideshow = [];

window.onload = function() {
    alles();
}


function alles() {

    $.get('b_lovely_landscapes.txt', function(data) {
        // console.log(data);

        var lines = (data.split("\n")).slice(1);

        // kleiner maken
        lines = lines.slice(79900)

        // get the lines
        $.each(lines, function(n, line) {

            // split on space
            var parts = line.split(" ");
            var photo = new Photo(n, parts.slice(2), parts[0], parts[1]);

            photosAll.push(photo);

            if(parts[1] == "V") {
                photosVertical.push(photo);
            }
            else {
                photosHorizontal.push(photo);
            }

        });

        doOtherThings();

    }, "text");
}

function doOtherThings(){
    console.log(photosHorizontal);
    console.log(photosVertical);
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

function makeRandomSlideshow(photosall, photos1, photos2) {


    var slideshow = [];
    photosall = shuffle(photosall);

}



function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
