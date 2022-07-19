import type ConfigData from "./ConfigData"
import terrainArray from "./TerrainArray"
// works in node, not on browser
import hull from "hull.js"
import catmulRomInterpolation from "catmull-rom-interpolator"
import * as three from "three"

export default class TrackGeneration {
    mapArray:number[][];
    firstPt:number[];
    margin:number;
    borderWidth:number; // y
    borderHeight:number; // x
    numPts:number;
    mapHeight:number;
    mapWidth:number;

    constructor(mapConfigData:ConfigData) {
        this.mapArray = [];
        this.firstPt = [];

        this.mapHeight = mapConfigData.mapHeight;
        this.mapWidth = mapConfigData.mapWidth;

        this.margin = 0.1;  // buffer around screen border
        this.borderWidth = Math.trunc(this.mapWidth * this.margin);
        this.borderHeight = Math.trunc(this.mapHeight * this.margin);
        this.numPts = 20;
    }

    generateRandomPoints() {
        // generating random points
        let points:number[][] = [];

        for (let i = 0; i < this.numPts; i++) {
            let temp:number[] = [];
            temp[0] = Math.random() * (this.mapHeight - 2 * this.borderHeight) + this.borderHeight;
            temp[1] = Math.random() * (this.mapWidth - 2 * this.borderWidth) + this.borderWidth;

            points.push(temp);
        }
        // console.log("points: ", JSON.stringify(points));
        return points;
    }

    findConvexHull(points:number[][]) {
        // calculating convex hull points
        const concavityVal:number = 80;   // from 1 to inf, closer to 1: hugs shape more
        let convexHull:object[] = [];

        convexHull = hull(points, concavityVal);
        convexHull.pop();

        // console.log("hull: ", JSON.stringify(convexHull));
        return convexHull as number[][];
    }

    findSpline(convexHull:number[][]) {
        // calculating catmull rom spline points
        // alpha: 0 to 1, centripedal:  0.5, chordal (more rounded): 1
        const alpha:number = 0.75;
        const ptsBtHull:number = 2;

        let splinePts:number[][] = [];

        splinePts = catmulRomInterpolation(convexHull, alpha, ptsBtHull, true);
        splinePts = catmulRomInterpolation(convexHull, alpha, ptsBtHull, true);
        splinePts = catmulRomInterpolation(convexHull, alpha, ptsBtHull, true);
        for (let i = 0; i < splinePts.length; i++) {
            splinePts[i][0] = Math.trunc(splinePts[i][0]);
            splinePts[i][1] = Math.trunc(splinePts[i][1]);
        }
        splinePts.push([splinePts[0][0], splinePts[0][1]]);

        // console.log("spline: ", JSON.stringify(splinePts));
        return splinePts;
    }

    fillInLoop(splinePts:number[][]) {
        // filling in polygon
        let loop:number[][] = splinePts;
        let prevPrevInd:number = -1;
        let prevPt:number[] = loop[0];

        for (let i = 1; i < loop.length; i++) {
            if (prevPt[0] == loop[i][0] && prevPt[1] == loop[i][1]) {
                loop.splice(i, 1);
                i--;
                prevPt = loop[i];
                continue;
            }

            if (i == loop.length) {
                continue;
            }

            let xDiff:number = Math.abs(prevPt[0] - loop[i][0]);
            let yDiff:number = Math.abs(prevPt[1] - loop[i][1]);
            let tempPt:number[] = prevPt;
            

            if (xDiff != 0) {
                if (prevPt[0] - loop[i][0] > 0) {
                    // console.log("prev x bigger")
                    tempPt = [prevPt[0] - 1, prevPt[1]];
                } else if (prevPt[0] - loop[i][0] < 0) {
                    // console.log("prev x smaller")
                    tempPt = [prevPt[0] + 1, prevPt[1]];
                }
                if (tempPt == loop[prevPrevInd]) {
                    tempPt[0] = loop[i][0];
                    tempPt[1] = prevPt[1];
                }
                loop.splice(i, 0, tempPt);

                xDiff = Math.abs(prevPt[0] - loop[i][0]);
                yDiff = Math.abs(prevPt[1] - loop[i][1]);
            }

            if (xDiff == 0 && yDiff != 0) {
                if (prevPt[1] - loop[i][1] > 1) {
                    // console.log("prev y bigger")
                    tempPt = [prevPt[0], prevPt[1] - 1];
                    loop.splice(i, 0, tempPt);
                } else if (prevPt[1] - loop[i][1] < 1) {
                    // console.log("prev y smaller")
                    tempPt = [prevPt[0], prevPt[1] + 1];
                    loop.splice(i, 0, tempPt);
                }
            }

            prevPrevInd++;
            prevPt = loop[i];
        }

        // console.log("loop: ");
        // for (let i = 0; i < loop.length; i++) {
        //     console.log("(", loop[i][0], ", ", loop[i][1], ")");
        // }
        return loop;
    }

    createMapArray() {
        // creating mapArray matrix
        let points:number[][] = this.generateRandomPoints();
        let convexHull:number[][] = this.findConvexHull(points);

        let numPtMoves:number = 3;
        let distVal:number = 10;
        for(let i = 0; i < numPtMoves; ++i) {  
            convexHull = this.movePtsApart(convexHull, distVal);  
        } 

        //push apart again, so we can stabilize the points distances. 
        let adjustedConvexPts:number[][] = this.adjustConvexity(convexHull);

        console.log("after convexity");
        for (let i = 0; i < adjustedConvexPts.length; i++) {
            console.log("(", adjustedConvexPts[i][0], ", ", adjustedConvexPts[i][1], ")");
        }

        // issues with looping after adjusting convexity if movePtsApart

        numPtMoves = 3;
        distVal = 5;
        for(let i = 0; i < numPtMoves; ++i) {  
            adjustedConvexPts = this.movePtsApart(adjustedConvexPts, distVal);  
        } 

        console.log("after move");
        for (let i = 0; i < adjustedConvexPts.length; i++) {
            console.log("(", adjustedConvexPts[i][0], ", ", adjustedConvexPts[i][1], ")");
        } 

        let fixedAnglePts:number[][] = adjustedConvexPts;
        for(let i = 0; i < 1; ++i) {
            fixedAnglePts = this.fixLoopAngles(fixedAnglePts); 
            
            // adjustedPts = this.movePtsApart(adjustedPts);  
        }  

        let splinePts:number[][] = this.findSpline(fixedAnglePts);

        let loop:number[][] = this.fillInLoop(splinePts);
        // let loop:number[][] = this.fillInLoop(fixedAnglePts);

        // let t;
        // let a:number;
        // let r = loop.filter((t={},a=>!(t[a]=a in t)));

        for (let i = 0; i < this.mapHeight; i++) {
            let temp:number[] = [];
            for (let j = 0; j < this.mapWidth; j++) {
                temp.push(162);
            }
            this.mapArray.push(temp)
        }

        let prev:number[] = loop[0];
        let curr:number[];
        let next:number[];
        for (let i = 1; i < loop.length; i++) {
            curr = loop[i];
            if (i < loop.length - 1) {
                next = loop[i + 1];
            }
            else {
                next = loop[1];
            }

            this.determineTileToPlace(prev, curr, next);

            prev = curr;
            // this.mapArray[loop[i][0]][loop[i][1]] = 252;
            // this.mapArray[splinePts[i][0]][splinePts[i][1]] = 221
        }

        this.firstPt = loop[0];
        console.log(JSON.stringify(loop));
        // console.log(JSON.stringify(this.mapArray))
    }

    determineTileToPlace(prev:number[], curr:number[], next:number[]) {
        if (prev[0] == curr[0]) {
            if (next[0] == curr[0]) {
                this.fillHorizontal(curr);
            }
            else if (prev[1] < curr[1]) {
                if (next[0] < curr[0]) {
                    this.fillSE(curr);
                }
                else if (next[0] > curr[0]) {
                    this.fillNE(curr);
                }
            }
            else if (prev[1] > curr[1]) {
                if (next[0] < curr[0]) {
                    this.fillSW(curr);
                }
                else if (next[0] > curr[0]) {
                    this.fillNW(curr);
                } 
            }
        }

        else if (prev[1] == curr[1]) {
            if (next[1] == curr[1]) {
                this.fillVertical(curr);
            }
            else if (prev[0] < curr[0]) {
                if (next[1] < curr[1]) {
                    this.fillSE(curr);
                }
                else if (next[1] > curr[1]) {
                    this.fillSW(curr);
                }
            }
            else if (prev[0] > curr[0]) {
                if (next[1] < curr[1]) {
                    this.fillNE(curr);
                }
                else if (next[1] > curr[1]) {
                    this.fillNW(curr);
                } 
            }
        }
    }

    fillHorizontal(mapCoord:number[]) {
        this.mapArray[mapCoord[0]][mapCoord[1]] = terrainArray.horizontal;
    }

    fillVertical(mapCoord:number[]) {
        this.mapArray[mapCoord[0]][mapCoord[1]] = terrainArray.vertical;
    }

    fillNW(mapCoord:number[]) {
        this.mapArray[mapCoord[0]][mapCoord[1]] = terrainArray.NW;
    }

    fillNE(mapCoord:number[]) {
        this.mapArray[mapCoord[0]][mapCoord[1]] = terrainArray.NE;
    }

    fillSE(mapCoord:number[]) {
        this.mapArray[mapCoord[0]][mapCoord[1]] = terrainArray.SE;
    }

    fillSW(mapCoord:number[]) {
        this.mapArray[mapCoord[0]][mapCoord[1]] = terrainArray.SW;
    }


    movePtsApart(points:number[][], distVal:number) {  
        // let distVal:number = 10; //I found that 15 is a good value, though maybe, depending on your scale you'll need other value.  
        let maxDist:number = distVal ** 2;
        let distBtPts:number;

        // console.log("before move", JSON.stringify(points))

        for (let i = 0; i < points.length; ++i) {
            for (let j = i + 1; j < points.length; ++j) {
                distBtPts = ((points[j][0] - points[i][0]) ** 2) + ((points[j][1] - points[i][1]) ** 2);

                // console.log("dist",distSq)
                if (distBtPts < maxDist) {
                    let dx = points[j][0] - points[i][0];
                    let dy = points[j][1] - points[i][1];
                    let dl = Math.sqrt(dx ** 2 + dy ** 2);
                    dx /= dl;
                    dy /= dl;
                    let diff = distVal - dl;
                    dx *= diff;
                    dy *= diff;
                    points[j][0] += dx;
                    points[j][1] += dy; 
                    points[i][0] -= dx;
                    points[i][1] -= dy; 

                    points[i] = this.checkPtWithinBorder(points[i]);

                    points[j] = this.checkPtWithinBorder(points[j]);
                }
            }
        }
        // console.log("after move", JSON.stringify(points))

        return points;
    }

    rotatePt(point:number[], radians:number) {
        let cos = Math.cos(radians);
		let sin = Math.sin(radians);

		let x = point[0] * cos - point[1] * sin;
		let y = point[0] * sin + point[1] * cos;

		point[0] = x;
		point[1] = y;

        return point;
    }

    adjustConvexity(points:number[][]) {
        let adjustedPoints:number[][] = [];  
        let displacement:number[] = [];  
        let difficulty:number = 1; //the closer the value is to 0, the harder the track should be. Grows exponentially.  
        let maxDisp:number = 10; // Again, this may change to fit your units. 

        // console.log("before adjust: "); 
        // for (let i = 0; i < points.length; i++) {
        //     console.log("(", points[i][0], ", ", points[i][1], ")");
        // }
        
        
        for(let i = 0; i < points.length; ++i) {  
            let dispLen:number = (Math.random() ** difficulty) * maxDisp;  
            displacement = [0, 1];  

            let rotationRad = (Math.random() * 360) * Math.PI / 180
            displacement = this.rotatePt(displacement, rotationRad);
            displacement[0] *= dispLen
            displacement[1] *= dispLen

            adjustedPoints[i * 2] = points[i];  
            adjustedPoints[i * 2 + 1] = points[i];  
      
            let nextPt:number[];
            nextPt = i < points.length - 1 ? points[i + 1] : points[0];
            // if (i < points.length - 1) {
            //     nextPt = points[i + 1];
            // }
            // else {
            //     nextPt = points[0];
            // }

            let temp:number[] = [];
            // midpoint calculation
            temp[0] = (adjustedPoints[i * 2 + 1][0] + nextPt[0]) / 2 + displacement[0];
            temp[1] = (adjustedPoints[i * 2 + 1][1] + nextPt[1]) / 2 + displacement[1];

            temp = this.checkPtWithinBorder(temp);

            adjustedPoints[i * 2 + 1] = temp;
            // adjustedPoints[i * 2 + 1][0] = ((adjustedPoints[i * 2 + 1][0] + (nextPt[0] % points.length)) / 2) + displacement[0];
            // adjustedPoints[i * 2 + 1][1] = ((adjustedPoints[i * 2 + 1][1] + (nextPt[1] % points.length)) / 2) + displacement[1];

        }

        return adjustedPoints;
    }

    fixLoopAngles(points:number[][]) {
        let angle:number = 95;
        // let prev = points[0];

        for(let i = 0; i < points.length; ++i) {  
            let prev:number = (i-1 < 0) ? points.length-1 : i-1;  
            let next:number = (i+1) % points.length;  

            let px:number = points[i][0] - points[prev][0];  
            let py:number = points[i][1] - points[prev][1];  
            let pl:number = Math.sqrt(px**2 + py**2);  
            px /= pl;  
            py /= pl;  
            
            let nx:number = points[i][0] - points[next][0];
            let ny:number = points[i][1] - points[next][1];
            nx = -nx;  
            ny = -ny;  
            let nl:number = Math.sqrt(nx*nx + ny*ny);  
            nx /= nl;  
            ny /= nl;  
            //I got a vector going to the next and to the previous points, normalised.  

            let a:number = Math.atan2(px * ny - py * nx, px * nx + py * ny); // perp dot product between the previous and next point. Google it you should learn about it!  

            if(Math.abs(a * 180 / Math.PI) <= angle) continue;  

            let nA = angle * Math.sign(a) * Math.PI / 180;  
            let diff = nA - a;  
            let cos = Math.cos(diff);  
            let sin = Math.sin(diff);  
            let newX = nx * cos - ny * sin;  
            let newY = nx * sin + ny * cos;  
            newX *= nl;  
            newY *= nl;  
            points[next][0] = points[i][0] + newX;  
            points[next][1] = points[i][1] + newY;  

            // if less than 0
            points[next] = this.checkPtWithinBorder(points[next]);
            //I got the difference between the current angle and 100degrees, and built a new vector that puts the next point at 100 degrees.  
        }

        return points;
    }

    checkPtWithinBorder(coordinate:number[]) {
        // if less than border
        let minHeight:number = this.borderHeight;
        let minWidth:number = this.borderWidth;

        coordinate[0] = coordinate[0] < minHeight ? minHeight : coordinate[0];
        coordinate[1] = coordinate[1] < minWidth ? minWidth : coordinate[1];

        // if less than 0
        // coordinate[0] = coordinate[0] < 0 ? -coordinate[0] : coordinate[0];
        // coordinate[1] = coordinate[1] < 0 ? -coordinate[1] : coordinate[1];

        // if greater than border
        let maxHeight:number = this.mapHeight - this.borderHeight;
        let maxWidth:number = this.mapWidth - this.borderWidth;

        coordinate[0] = coordinate[0] >= maxHeight  ? maxHeight : coordinate[0];
        coordinate[1] = coordinate[1] >= maxWidth ? maxWidth : coordinate[1];

        // coordinate[0] = coordinate[0] >= maxHeight  ? maxHeight - (coordinate[0] - maxHeight) : coordinate[0];
        // coordinate[1] = coordinate[1] >= maxWidth ? maxWidth - (coordinate[1] - maxWidth) : coordinate[1];

        return coordinate;
    }

    // getMapArray() {
    //     return this.mapArray;
    // }

    // getFirstPt() {
    //     return this.firstPt;
    // }

}
