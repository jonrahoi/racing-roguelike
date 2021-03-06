import type ConfigData from "./ConfigData"
import type MapArray from "./MapArray"
// import TrackGeneration from "./TrackGeneration"

export default class TileMapConstruct {
    scene: Phaser.Scene;
    track: object;
    mapArray: number[][];
    tileMap: Phaser.Tilemaps.Tilemap;

    constructor(scene:Phaser.Scene, map: MapArray, mapConfigData: ConfigData) {
        this.mapArray = map.mapArray


        this.scene = scene
        // scene.mapArray = mapArray

        const mapConfig = {
            // data: scene.mapArray, 
            data: this.mapArray,
            tileWidth: mapConfigData.tileDimension, 
            tileHeight: mapConfigData.tileDimension 
        }

        this.tileMap = scene.make.tilemap(mapConfig);
        // const tileset = map.addTilesetImage(mapData.tiles);
        // this.roadLayer = map.createLayer(0, tileset, 0, 0); 

    }

    // get TileMap() {
    //     return this.tileMap;
    // }
}
// export default tileMapConstruct