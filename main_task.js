/*
Main code for creating and drawing the shapes
*/
// First define some useful functions
// create an array in a [min, max] range
const arrayRange = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
/* recursively check for the required checks:
    outer number of edge > inner
    outer size > inner
*/
// function applyChecks(noEdgeOut, noEdgeIn, sizeOut, sizeIn, numEdgesInnArr, sizeInArr){
//     if((noEdgeOut > noEdgeIn) && (sizeOut > sizeIn)){
//         // console.log('Func output: ', [noEdgeOut, noEdgeIn, sizeOut, sizeIn])
//         return [noEdgeOut, noEdgeIn, sizeOut, sizeIn]
//     } else{
//         if (noEdgeOut <= noEdgeIn){
//             const isLargeNumber = (element) => element > noEdgeIn;
//             var noEdgeInNew = numEdgesInnArr[Math.floor(Math.random() * (numEdgesInnArr.findIndex(isLargeNumber)-1))];
//         }
//         else {
//             var noEdgeInNew = noEdgeIn;
//         }
//         if (sizeOut <= sizeIn){
//             const isLargeNumber = (element) => element > sizeIn;
//             var sizeInNew = sizeInArr[Math.floor(Math.random() * (sizeInArr.findIndex(isLargeNumber)-1))];
//         }
//         else {
//             var sizeInNew = sizeIn;
//         }
//         return applyChecks(noEdgeOut, noEdgeInNew, sizeOut, sizeInNew, numEdgesInnArr, sizeInArr);
//     }
// }
// This function gets polygon attributes, and checks them regarding size & colour
function applyChecks(polyAttrs){
    for (let i=0; i<polyAttrs.length-1; i++){
        if (i > 0){
            // in-out size

            // colours

            // 
        }
        polyAttrs[i]
    }
}
function drawPolygon(sides, radius, cx, cy, fillColour, edgeColour){
    var points = [];
    console.log('Func input: ', [sides, radius, cx, cy, fillColour, edgeColour])
    for(var i=0; i<sides; i++){
        var angle = (i*2*Math.PI)/sides;
        var x = cx + radius * Math.cos(angle);
        var y = cy + radius * Math.sin(angle);
        points.push(String(x) + "," + String(y));
    }
    console.log(toString(points))
    var outStr = '<polygon points="'+points+'" style="fill:'+String(fillColour)+';stroke:'+String(edgeColour)+';stroke-width:5" />';
    console.log(outStr);
    return outStr;
}
function createStimulus() {
    // Now create the stim configs, for now hardcoded
    const numTotShapeArr = arrayRange(0, 3, 1);
    const numEdgesArr = arrayRange(3, 10, 1);
    const edgeColourArr = ['red', 'blue', 'yellow', 'green', 'orange'];
    const fillColourArr = ['red', 'blue', 'yellow', 'green', 'orange'];
    const sizeArr = arrayRange(10, 90, 10);
    // initialise the stimuli array and polygon configs array now
    const stimuli = [];
    let polyConfs = [];
    // and fill it in a loop (because we have 2 shapes in the screen at the same time)
    for (let i = 0; i < 2; i++) {
        // instantiate all the required variables first
        // but most importantly, number of stacked polygons
        var numTotShape = numTotShapeArr[Math.floor(Math.random() * numTotShapeArr.length)];
        for (let j=0; j<numTotShape-1; j++){ 
            // in a for loop instantiate other variables
            var numEdges = numEdgesArr[Math.floor(Math.random() * numEdgesArr.length)];
            var edgeColour = edgeColourArr[Math.floor(Math.random() * edgeColourArr.length)];
            var fillColour = fillColourArr[Math.floor(Math.random() * fillColourArr.length)];
            var size = sizeArr[Math.floor(Math.random() * sizeArr.length)];
            polyConfs.push([numEdges, edgeColour, fillColour, size]);
            // console.log('Polygon attrs: ', polyConfs);
        }

        // // now handle the checks first
        // const [numEdgeOutNew, numEdgeInnNew, sizeOutNew, sizeInNew] = applyChecks(numEdgeOut, numEdgeInn, sizeOut, sizeIn, numEdgesInnArr, sizeInArr);
        // create the shape now in html form
        // but do it in a loop, so multi shapes can be created
        let html = '';
        for (let q = 0; q < numTotShape-1; q++){
            console.log('Number of stacked shapes:', numTotShape);
            html = '<svg width="${sizeOutNew * 2}" height="${sizeOutNew * 2}" style="margin:5px; opacity: ${1.0};">';
            html += drawPolygon(polyConfs[q][0], polyConfs[q][3], 100, 100, polyConfs[q][2], polyConfs[q][1]);
        }
        // push to the stimuli
        // stimuli.push({html, numEdgeOutNew, numInnerShape, numEdgeInnNew, outEdgeColour, outFillColour, inEdgeColour, inFillColour, sizeOutNew, sizeInNew});
        stimuli.push({html})
    }
    return stimuli;
}
// Push to LearningBlock
let learningBlock = [];
let n_Trials = 10;
for (let i = 0; i < n_Trials; i++) {
    let stimuli = createStimulus();
    
    let learningTrials = {
        type: jsPsychHtmlButtonResponse,
        stimulus: stimuli.map(s => s.html).join(' '),
        choices: ['Option 1', 'Option 2'],
        post_trial_gap: 0,
        on_finish: function (data) {
            let choice = data.button_pressed;
        }
    };
    learningBlock.push(learningTrials);
}