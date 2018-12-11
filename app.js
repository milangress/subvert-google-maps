let baseUrl = 'https://api.are.na/v2/'
let channelArray
let map

// http://api.are.na/v2/channels/subvert-google-maps-with-air-pollution/contents?page=1&per=50
async function getChannel(page = 1, per = 50) {
    let arenaChannel = 'subvert-google-maps-with-air-pollution'
    let arenaPage = 1
    let perPage = 50
    let apiUrl = `${baseUrl}channels/${arenaChannel}/contents?page=${arenaPage}&per=${perPage}`
    const response = await fetch(apiUrl)
    const channelData = await response.json()
    return channelData.contents
}
function randomUrl(channelArray) {
    let element = sample(channelArray)
    if (element.class === 'Image') {
        console.log('Random url: ' + element.image.square.url)
        return element.image.square.url
    } else {
        console.log('No Image')
        randomUrl(channelArray)
    }

}
function sample(arr){
    console.log(arr)
    return arr[Math.floor(Math.random() * arr.length)]
}




(async () => {
    try {
        let channelArray = await getChannel()
        console.log('try channel Array')
        console.log('Maps: ' + randomUrl(channelArray))

        var moonMapType = new google.maps.ImageMapType({
            getTileUrl: () => {
                return randomUrl(channelArray)
            },
            tileSize: new google.maps.Size(220, 220),
            maxZoom: 8,
            minZoom: 0,
            name: 'Subverting'
        });

        map.mapTypes.set('moon', moonMapType);
        map.setMapTypeId('moon');

    } catch (e) {
        console.log(e)
    }

})();

// function setMapData() {
//     var moonMapType = new google.maps.ImageMapType({
//         getTileUrl: function(coord, zoom) {
//             var normalizedCoord = getNormalizedCoord(coord, zoom);
//             if (!normalizedCoord) {
//                 return null;
//             }
//             var bound = Math.pow(2, zoom);
//             return 'https://d2w9rnfcy7mm78.cloudfront.net/1274121/square_a99c240159ea3b5b51f51667e67a6d8c.jpg'
//
//         },
//         tileSize: new google.maps.Size(220, 220),
//         maxZoom: 8,
//         minZoom: 0,
//         radius: 1738000,
//         name: 'Moon'
//     });
//
//     map.mapTypes.set('moon', moonMapType);
//     map.setMapTypeId('moon');
//
// }


function initMap() {
     map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 49.9863889, lng: 8.241666666666665},
        zoom: 4,
        streetViewControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['moon']
        }
    });

    // var moonMapType = new google.maps.ImageMapType({
    //     getTileUrl: function(coord, zoom) {
    //         var normalizedCoord = getNormalizedCoord(coord, zoom);
    //         if (!normalizedCoord) {
    //             return null;
    //         }
    //         var bound = Math.pow(2, zoom);
    //         return 'https://d2w9rnfcy7mm78.cloudfront.net/1274121/square_a99c240159ea3b5b51f51667e67a6d8c.jpg'
    //
    //     },
    //     tileSize: new google.maps.Size(220, 220),
    //     maxZoom: 8,
    //     minZoom: 0,
    //     radius: 1738000,
    //     name: 'Moon'
    // });
    //
    // map.mapTypes.set('moon', moonMapType);
    // map.setMapTypeId('moon');
}

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    // tile range in one direction range is dependent on zoom level
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
    var tileRange = 1 << zoom;

    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
        return null;
    }

    // repeat across x-axis
    if (x < 0 || x >= tileRange) {
        x = (x % tileRange + tileRange) % tileRange;
    }

    return {x: x, y: y};
}
