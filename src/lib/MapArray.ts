import TrackGeneration from "./TrackGeneration"
import type ConfigData from "./ConfigData"

export default class MapArray {
    mapArray: number[][];
    firstPt: number[];
    trackArray:number[][];
    track: TrackGeneration;
    
    constructor(mapConfigData: ConfigData) {
        this.track = new TrackGeneration(mapConfigData);

        this.track.createMapArray();
        this.mapArray = this.track.mapArray;
        this.trackArray = this.track.trackArray;
        this.firstPt = this.track.firstPt;

        // console.log(this.firstPt);
        // console.log(this.mapArray[20]);
    }

}



// let mapArray = 
// [[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,252,252,162,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,252,252,162,162,252,252,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,252,252,252,162,162,162,252,252,252,252,252,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,252,252,252,252,162,162,162,252,252,252,252,252,162,162,162,162,162,162,162,162,162,162,252,252,162],[162,162,162,162,162,162,162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162],[162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162],[162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162],[162,162,162,162,162,162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,162],
// [162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],
// [162,162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162],[162,162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,162,162],[162,162,162,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162],
// [162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,162,162,162,162],[162,162,162,252,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,252,252,252,252,252,252,252,252,162,162,162,162,162,162,162,252,252,162,162,162,162],[162,162,162,252,252,162,162,162,162,162,162,162,252,252,252,252,252,252,162,162,162,162,162,162,162,162,252,252,252,162,162,162,162,252,252,162,162,162,162,162],[162,162,162,162,252,252,162,252,252,252,252,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,252,252,252,252,252,252,162,162,162,162,162,162],[162,162,162,162,162,252,252,252,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162],[162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162,162]]

