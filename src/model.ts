import * as tf from '@tensorflow/tfjs-node';

let model: tf.LayersModel;

const loadAndPredict = async (modelPath: string, x: tf.Tensor) => {
  if (model === undefined) {
    model = await tf.loadLayersModel(`file://${modelPath}`);
  }
  const result = model.predict(x);
  if (!Array.isArray(result)) {
    result.print();
    return result.data();
  }
  return false;
};

export default loadAndPredict;
