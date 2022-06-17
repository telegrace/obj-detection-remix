import { trainingData } from "~/data/mnist";

const inputs = trainingData.inputs;
const outputs = trainingData.outputs;

tf.util.shuffleCombo(inputs, outputs);

const inputsTensor = tf.tensor2d(inputs);
const outputsTensor = tf.oneHot(tf.tensor1d(outputs, "int32"), 10);

//create and define model architecture.
const model = tf.sequential();

model.add(
  tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" })
);
model.add(tf.layers.batchNormalization()); //this makes the weights more homogeneous.
// model.add(tf.layers.dropout({ rate: 0.5 })); //gets rid of overfitting, but not really needed with batchNormalization

model.add(tf.layers.dense({ units: 16, activation: "relu" }));

model.add(tf.layers.dense({ units: 10, activation: "softmax" }));

model.summary();

await train();

await model.save("downloads://model");

async function train() {
  // Compile the model with the defined optimizer and specify a loss function to use.
  model.compile({
    optimizer: "adam", // Adam changes the learning rate over time which is useful.
    loss: "categoricalCrossentropy", // As this is a classification problem, dont use MSE.
    metrics: ["accuracy"], // As this is a classifcation problem you can ask to record accuracy in the logs too!
  });

  // the training itself
  let results = await model.fit(inputsTensor, outputsTensor, {
    shuffle: true,
    validationSplit: 0.2,
    batchSize: 512, // Update weights after every 512 examples.
    epochs: 50,
    callbacks: { onEpochEnd: logProgress },
  });

  outputsTensor.dispose();
  inputsTensor.dispose();

  // Once trained we can evaluate the model.
  evaluate();
}

const logProgress = (epoch, logs) => {
  console.log("Data for epoch " + epoch, logs);
};

const PREDICTION_ELEMENT = document.getElementById("prediction");

function evaluate() {
  // Select a random index from all the example images we have in the training data arrays.
  const OFFSET = Math.floor(Math.random() * INPUTS.length);

  // Clean up created tensors automatically.
  let answer = tf.tidy(function () {
    let newInput = tf.tensor1d(INPUTS[OFFSET]);

    let output = model.predict(newInput.expandDims());
    output.print();

    return output.squeeze().argMax();
  });

  answer.array().then(function (index) {
    PREDICTION_ELEMENT.innerText = index;
    PREDICTION_ELEMENT.setAttribute(
      "class",
      index === OUTPUTS[OFFSET] ? "correct" : "wrong"
    );
    answer.dispose();
    drawImage(INPUTS[OFFSET]);
  });
}

const CANVAS = document.getElementById("canvas");
const CTX = CANVAS.getContext("2d");

function drawImage(digit) {
  var imageData = CTX.getImageData(0, 0, 28, 28);

  for (let i = 0; i < digit.length; i++) {
    imageData.data[i * 4] = digit[i] * 255; // Red Channel.
    imageData.data[i * 4 + 1] = digit[i] * 255; // Green Channel.
    imageData.data[i * 4 + 2] = digit[i] * 255; // Blue Channel.
    imageData.data[i * 4 + 3] = 255; // Alpha Channel.
  }

  // Render the updated array of data to the canvas itself.
  CTX.putImageData(imageData, 0, 0);

  setTimeout(evaluate, interval);
}

let interval = 3000;
