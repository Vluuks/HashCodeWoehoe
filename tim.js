



d3.text("a_example.txt").then(function(data){
    console.log(data.split("\n"));
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

    vert.forEach(function(v){
        console.log(v);
    })

    // van 2 vert naar 1 slide
    function makeSlide(vert1, vert2){
        slide = {};
        slide["tags"] = vert1.tags;
        slide["ID"] = -1;
        vert2.tags.forEach(function(tag){
            if (slide["tags"].indexOf(tag) > -1){
                slide["tags"].push(tag);
            }
        });
        slide["numTags"] = slide["tags"].length;
        slide["photos"] = [vert1, vert2];
        return slide;
    }

    s = makeSlide(vert[0], vert[1])
    console.log(s);

    slides = [];
});
