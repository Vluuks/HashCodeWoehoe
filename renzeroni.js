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

var testtest;

window.onload = function() {
    alles();
}


function alles() {

    $.get('e_shiny_selfies.txt', function(data) {
        // console.log(data);

        var lines = (data.split("\n")).slice(1);
        
        // kleiner maken
        lines = lines.slice(79970);

        if(lines.length % 2 != 0)
            lines.pop();
        
        // get the lines
        $.each(lines, function(n, line) {
            
            // split on space

            console.log(line);
            var parts = line.split(" ");
            console.log(parts[0]);
            var photo = new Photo(n, parts.slice(2), parts[0], parts[1]);

            photosAll.push(photo);

            if(parts[0].trim() == "V") {
                photosVertical.push(photo);
                // console.log("waar?");
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
    var things2 = makeVerticals(photosVertical);

    console.log(things2);
    // console.log("after return but before matching");
    // console.log(things.length);
    // console.log(things);
    // console.log("---------------------------");


    // resort
    // var perhapsbetterthings = findMatchingPhotoSlideSomewhatRandomly(things);
    // console.log(perhapsbetterthings);
}


// sort by amount of tags 
function makeSlidesWithNoRegardForScore(verts, horizontals) {

    // console.log("vertcount" + verts.length);
    // console.log("hztlcount" + horizontals.length);
    // console.log(verts);
    // console.log(horizontals);

    var verticalSlides = [];
    var horizontalSlides = [];

    for(var i = 0, j = 0; i < verts.length; i += 2, j++) {

        tags = (verts[i].tags) + (verts[i+1].tags);
        tagCount = verts[i].numTags + verts[i+1].numTags;
        
        // add to vertical slides
        verticalSlides.push(new Slide(j, [verts[i], verts[i+1]], tagCount, tags));

    }

    for(var i = 0; i < horizontals.length; i++) {


        horizontalSlides.push(new Slide(i, horizontals[i], horizontals[i].numTags, horizontals[i].tags));
     
    }



    // add together and return
    // console.log("geen plak");
    // console.log(horizontalSlides);
    // console.log(verticalSlides);

    var concatarr = verticalSlides.concat(horizontalSlides);
    // horizontalSlides.push.apply(horizontalSlides, verticalSlides);
    // console.log("plak plak?");
    // console.log(concatarr);
    testtest = concatarr;
    return concatarr;

}


function makeVerticals(photos) {

    console.log(photos);

    // split in half
    var half = Math.ceil(photos.length / 2);   
    
    photos2 = JSON.parse(JSON.stringify(photos));

    var photoshalf = photos.splice(0, half);

    console.log(photos2.length);
    var photoshalf2 = photos2.splice(half, photos2.length / 2 );
    shuffle(photoshalf);
    shuffle(photoshalf2);

    console.log(photoshalf.length);
    console.log(photoshalf2.length);

    var verticalSlides = [];

    // go backwards
    for(var i = photoshalf.length-1; i >= 0; i--){

        // get a random index
        var index = Math.floor(Math.random() * photoshalf.length);

        // grab both at this index in either half
        var tagCount = photoshalf[index].numTags + photoshalf2[index].numTags;
        var tags = (photoshalf[index].tags).concat(photoshalf2.tags);

        var slide = new Slide(i, [photoshalf[index], photoshalf2[index]], tagCount, tags)
        verticalSlides.push(slide);


        photoshalf.splice(index, 1);
        photoshalf2.splice(index, 1);

      }

      return verticalSlides;

}


// comparetags and give similarity score
function compareTags(tags1, tags2) {

    var matchcount;
    $.each(tags1, function(n, tag) {
        if(tags2.includes(tag)) {
            matchcount++;
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


// function findMatchingPhotoSlideSomewhatRandomly(slides) {

//     console.log("input");
//     console.log(slides);

//     var slideshow = [];
//     var shittymatches = [];
//     var comparisonArray = slides;
    

//     for(i = 0, j = 0; i < slides.length; i+=2, j++) {

//         // generate random index that is not itself
//         // this will be the slide to compare against
//         var photoslide = slides[j];
//         var index;

//         // make new index
//         index = randomeroni(0, comparisonArray.length - 2);
//         // console.log("len" + comparisonArray.length);
//         // console.log(index);

//         // check if the slides have a lot of matching tags
//         var match = compareTags(photoslide.tags, comparisonArray[index].tags);

//         // remove matched photo from array
//         if(match > 5) {
//             slideshow.push(photoslide)
//             slideshow.push(comparisonArray[index])
//         }
//         else {
//             shittymatches.push(photoslide)
//             shittymatches.push(comparisonArray[index])
//         }

//         // delete first element, since we remove the one at the start every time
//         // this element represents the slide we use as a basis
//         comparisonArray.shift();

//         // also delete the one we compare with
//         comparisonArray.splice(index, 1);

//         console.log(comparisonArray.length);


//         // if stray element, do this
//         if(slides.length < 2) {
//             slideshow.push(slides[0]);
//             break;
//         }
//     }
    

//     console.log("hmmmmmm");
//     console.log(slideshow);
//     console.log(shittymatches);
//     console.log("bleh");

//     // concatenate trash with good parts
//     return slideshow.concat(shittymatches);

// }

function findMatchingPhotoSlideSomewhatRandomly(slides) {

    
 
    for(var i = 0; i < slides.length; i++) {
        if(slides[i] == undefined) {
            // console.log("cry");
        }
        // console.log(slides[i]);
    }
}


function randomeroni(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}