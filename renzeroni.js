function Photo(id, tags, orientation, numTags) {
    this.id = id;
    this.tags = tags;
    this.orientation = orientation;
    this.numTags = numTags;
}

function Slide(id, photos, tagCount, tags) {
    this.id = id;
    this.photos = photos;
    this.tagCount = tagCount;
    this.tags = tags;
}

var photosAll = [];
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
        lines = lines.slice(79970)
        
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
    // console.log(photosHorizontal);
    // console.log(photosVertical);
    var things = makeSlidesWithNoRegardForScore(photosVertical, photosHorizontal);
    // console.log(things);

    // resort
    var perhapsbetterthings = findMatchingPhotoSlideSomewhatRandomly(things);
    console.log(perhapsbetterthings);
}


// sort by amount of tags 
function makeSlidesWithNoRegardForScore(verts, horizontals) {

    var verticalSlides = [];
    var horizontalSlides = [];

    for(var i = 0; i < verts.length; i += 2, j++) {

        tags = (verts[i].tags) + (verts[i+1].tags);
        tagCount = verts[i].numTags + verts[i+1].numTags;
        
        // add to vertical slides
        verticalSlides.push(new Slide(j, [verts[i], verts[i+1]], tagCount, tags));

    }

    for(var i = 0; i < horizontals.length; i++) {
        horizontalSlides.push(new Slide(i, horizontals[i], horizontals[i].numTags, horizontals[i].tags));
    }


    // add together and return
    return verticalSlides.concat(horizontalSlides);


}



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

function makeRandomSlideshow(photos, photos1, photos2) {
    return shuffle(photos);
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


function findMatchingPhotoSlideSomewhatRandomly(slides) {

    var slideshow = [];
    var shittymatches = [];

    for(i = 0; i < slides.length; i++) {

        // generate random index that is not itself
        // this will be the slide to compare against
        var photoslide = slides[i];
        var index = randomeroni(i + 1, slides.length - 2);
        // console.log(index);

        // check if the slides have a lot of matching tags
        var match = compareTags(photoslide.tags, slides[index].tags);

        if(match > 5) {
            slideshow.push(photoslide)
            slideshow.push(slides[index])
        }
        else {
            shittymatches.push(photoslide)
            shittymatches.push(slides[index])
        }
    }
    
    // concatenate trash with good parts
    return slideshow.concat(shittymatches);

}


function randomeroni(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}