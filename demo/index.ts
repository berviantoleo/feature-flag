import featureFlag from "../src";

featureFlag('try_feature_flag').then((result) => {
    console.log(result);
});