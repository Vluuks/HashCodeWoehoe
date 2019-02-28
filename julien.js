d3.text("a_example.txt").then(function(data){
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
            photo["tags"].push(t.trim());
        });

        // in correcte array mieteren
        if (photo["orientation"] == "V"){
            vert.push(photo);
        } else {
            hors.push(photo);
        }
    });

    console.log(vert);

    // sorteert verticaal array op numTags
    vert.sort((a,b) => (a.numTags > b.numTags) ? 1 : ((b.numTags > a.numTags) ? -1 : 0));

    // vert.forEach(function(v){
    //     console.log(v);
    // })

    // van 2 vert naar 1 slide
    function makeSlide(vert1, vert2){
        slide = {};
        slide["tags"] = vert1.tags;
        slide["ID"] = -1;
        vert2.tags.forEach(function(tag){
            if ((slide["tags"].indexOf(tag) > -1)) {
                slide["tags"].push(tag);
            }
        });
        slide["numTags"] = slide["tags"].length;
        slide["photos"] = [vert1, vert2];
        return slide;
    }

    differenceTags(vert);
    console.log(vert);
    test = makeCombosVert(vert);
    console.log(test);
    s = makeSlide(vert[0], vert[1])
    console.log(s);


    slides = [];
});

// Stel je hebt verticale foto's bepaal dan de verschillen in tags tussen
// deze foto's


function differenceTags(vert) {

  let count = 0;
  vert.forEach(function(photo, i) {
    console.log(photo);
    photo["difference"] = [];
    vert.forEach(function(image, j) {

      if (!(photo.ID === image.ID)) {
        count = 0;
        image.tags.forEach(function(tag) {
          if (photo.tags.indexOf(tag) === -1) {
            count++;
          }
        })
        distance = {};
        distance[image.ID] = count;
        photo.difference.push(distance);
      }
    })
  })
}

function makeCombosVert(list) {
  temp = [];
  id = [];

  list.forEach(function(photo) {
    let distance = 0;
    let numberPhoto;
    photo.difference.forEach( function(d) {
      let newDistance = d[Object.keys(d)];
      if (newDistance > distance) {
        distance = newDistance;
        numberPhoto = Object.keys(d);
      }
    })
    console.log(distance);
    console.log(numberPhoto[0]);
    console.log(id.includes(photo.ID));
    console.log(id.includes(numberPhoto[0]));
    if ((!(id.includes(photo.ID))) && (!(id.includes(numberPhoto[0])))) {
      list.forEach(function(check) {
        if (check.ID === numberPhoto[0]) {
          id.push(photo.ID);
          id.push(check.ID);
          tempObj = makeSlide(photo, check);
          temp.push(tempObj);
        }
      })
    }
    // temp.push(numberPhoto[0]);
    // console.log(temp);
  })
  return temp;
}
