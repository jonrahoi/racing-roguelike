type terrainArrayData = {
    roadTileArray: number[],
    terrainTileArray: number[],
    horizontal: number,
    vertical: number,
    NW: number,
    NE: number,
    SE: number,
    SW: number
    // redRoadTiles: number[]
}

let terrainArray: terrainArrayData = {
    // red road tiles
    roadTileArray: [
        1, 2, 3, 4, 5, 
        19, 20, 21, 22, 23, 
        37, 38, 39, 40, 41, 
        55, 56, 57, 58, 59, 
        73, 74, 75, 76, 77, 
        91, 92, 93, 94, 95, 
        109, 110, 111, 112, 113, 
        127, 128, 129, 130, 131,
        145, 146, 147, 148, 149,
        163, 164, 165, 166, 167, //10 se: 165, ne: 167
        181, 182, 183, 184, 185,
        199, 200, 201, 202, 203, //12 sw: 201, nw: 203 
        217, 218, 219, 220, 221, //13 horizontal: 221
        235, 236, 237, 238, 239, //14 vertical: 239
        252, 253, 254, 255, 256,
        270, 271, 272, 273, 274,
        288, 289, 290, 291, 292,
        306, 307, 308, 309, 310
    ],

    terrainTileArray: [
        0, 18, 36, 54, 72, 90, 108, 126, 144, 162, 180, 198, 216, 234
    ],

    horizontal: 221,
    vertical: 239,
    NW: 203,
    NE: 167,
    SE: 308, //165,
    SW: 201

}

export default terrainArray