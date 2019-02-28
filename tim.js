// Laadt data in, maakt het in foto objecten, dan slideshow, dan hillclimber voor score, dan output
// Relatief trots op mezelf

// b_lovely_landscapes
// c_memorable_moments
// d_pet_pictures
// e_shiny_selfies

var iterations = 2000;


d3.text("e_shiny_selfies.txt").then(function(data){
    // console.log(data.split("\n"));
    data = data.split("\n");

    var amount = data[0];

    data.shift();
    data.pop();

    hors = [];
    vert = [];

    // foto's splitten
    data.forEach(function(d, i){
        // id telt op, orientation is V of H, numTags is aantal tags, tags is array aan tags (string)
        tempD = d.split(" ");
        photo = {};
        photo["ID"] = i;
        photo["orientation"] = tempD[0];
        photo["numTags"] = +tempD[1];
        photo["tags"] = [];

        // slice eerste 2 weg
        tempD.shift();
        tempD.shift();

        // tags toevoegen aan array
        tempD.forEach(function(t){
            photo["tags"].push(t);
        });

        // in correcte array mieteren
        if (photo["orientation"] == "V"){
            vert.push(photo);
        } else {
            hors.push(photo);
        }
    });

    // sorteert verticaal array op numTags
    vert.sort((a,b) => (a.numTags > b.numTags) ? 1 : ((b.numTags > a.numTags) ? -1 : 0));

    coupledVerts = makeVerticals(vert);

    // // make slides
    // for (var i = 0; i < vert.length; i += 2){
    //     coupledVerts.push(makeSlide(vert[i], vert[i+1]))
    // }

    console.log(coupledVerts);

    // slides array klaarzetten voor wegschrijven
    slides = [];

    hors.forEach(function(h){
        slides.push(h);
    })

    coupledVerts.forEach(function(v){
        slides.push(v);
    });

    console.log(slides);

    score = calculateScore(slides);

    console.log(score);
    const startScore = score;

    localMax = score;
    localMaxSlides = JSON.parse(JSON.stringify(slides));
    superSlides = JSON.parse(JSON.stringify(slides));

    // for (var t = 0; t < iterations; t++){
    //     tempSlides = [];
    //     tempSlides = swapTwoSlides(slides);
    //     tempScore = calculateScore(tempSlides);
    //     console.log(tempScore);
    //     if (tempScore > localMax){
    //         localMax = tempScore;
    //         superSlides = [];
    //         superSlides = JSON.parse(JSON.stringify(tempSlides))
    //     }
    //     if (tempScore < 0.9 * startScore){
    //         break;
    //     }
    //     console.log(t);
    // }

    console.log(localMax);
    console.log(slides);
    console.log(superSlides);

    // slides = findMatchingPhotoSlideSomewhatRandomly(slides);

    console.log(calculateScore(superSlides));

    // OUTPUT WEGSCHRIJVEN
    amount -= coupledVerts.length;

    output = amount + "\n";

    superSlides.forEach(function(k, i){
        if (k.photos != undefined){
            output += k.photos[0].ID;
            output += " ";
            output += k.photos[1].ID;
        } else {
            output += k.ID;
        }
        if (i < amount){
            output += "\n";
        }
    });


    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(output.trim());
    hiddenElement.target = '_blank';
    hiddenElement.download = 'output.txt';
    hiddenElement.click();

});

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

function swapTwoSlides(slides){
    a = randomeroni(0, slides.length);
    b = randomeroni(0, slides.length);
    c = slides[b];
    slides[b] = slides[a];
    slides[a] = c;
    return slides;
    // [slides[a], slides[b]] = [slides[b], slides[a]];
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

function calculateScore(as){
    score = 0;

    for (var i = 0; i < as.length - 1; i++){
        firstPhoto = [];
        sharedPhoto = [];
        secondPhoto = [];

        as[i].tags.forEach(function(s){
            if (!(as[i + 1]["tags"].indexOf(s) > -1)){
                firstPhoto.push(s);
            } else {
                sharedPhoto.push(s);
            }
        });

        as[i + 1].tags.forEach(function(s){
            if (!(slides[i]["tags"].indexOf(s) > -1)){
                secondPhoto.push(s);
            }
        });

        scores = [firstPhoto.length, sharedPhoto.length, secondPhoto.length];
        let minimum = Math.min.apply(Math, scores);
        score += minimum;
    }

    return score;
}

// van 2 vert naar 1 slide
function makeSlide(vert1, vert2){
    slide = {};
    slide["tags"] = vert1.tags;
    slide["ID"] = -1;
    vert2.tags.forEach(function(tag){
        if (!(slide["tags"].indexOf(tag) > -1)){
            slide["tags"].push(tag);
        }
    });
    slide["numTags"] = slide["tags"].length;
    slide["photos"] = [vert1, vert2];
    return slide;
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

function randomeroni(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
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
