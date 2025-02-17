const constants=require('../common/constants.js');
const utils=require('../common/utils.js');

const KNN=require('../common/classifiers/knn.js');

const fs=require('fs');

console.log("RUNNING CLASSIFICATION ...");

const {samples:trainingSamples}=JSON.parse(
   fs.readFileSync(constants.TRAINING)
);

const kNN=new KNN(trainingSamples,50);

const {samples:testingSamples}=JSON.parse(
   fs.readFileSync(constants.TESTING)
);

let totalCount=0;
let correctCount=0;
for(const sample of testingSamples){
   const {label:predictedLabel}=kNN.predict(sample.point);
   correctCount+=predictedLabel==sample.label
   totalCount++;
}



const accuracies = [];
for (let k = 1; k <= 100; k++) {
  const kNN = new KNN(trainingSamples, k);
  let totalCount = 0,
    correctCount = 0;
  for (const sample of testingSamples) {
    const { label: predictedLabel } = kNN.predict(sample.point);
    correctCount += predictedLabel == sample.label;
    totalCount++;
  }
  accuracies.push(Number(((correctCount / totalCount) * 100).toFixed(2)));
 
}

console.log("Precision para 100 vecinos:"+accuracies)

console.log("ACCURACY: "+
    correctCount+"/"+totalCount+" ("+
    utils.formatPercent(correctCount/totalCount)+
    ")"
 );
 console.log("GENERATING DECISION BOUNDARY ...");

const {createCanvas}=require('canvas');
const canvas=createCanvas(100,100);
const ctx=canvas.getContext('2d');

//generar lienzo de 100 por 100 y obtengamos acceso al contexto de dibujo
//será un grafico basado en. pixeles
//donde tomamos cada pixel individual de este lienzo y lo tratamos como una 
//caracteristica entre cer y uno
//lo normalizaremos y luego colorearemos el pixel dependiendo 
//del valor previsto que verás
for(let x=0;x<canvas.width;x++){
    for(let y=0;y<canvas.height;y++){
       const point=[
          x/canvas.width,
          1-y/canvas.height
       ];
       const {label}=kNN.predict(point);
       const color=utils.styles[label].color;
       ctx.fillStyle=color;
       ctx.fillRect(x,y,1,1);
    }
 }
 
 const buffer=canvas.toBuffer("image/png");
 fs.writeFileSync(constants.DECISION_BOUNDARY,buffer);
 
 console.log("DONE!");