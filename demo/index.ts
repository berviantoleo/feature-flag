import featureFlag from "../src";

for (let i of Array(50).fill(1).map((x, y) => x + y)) {
  setTimeout(() => {
    featureFlag("try_feature_flag").then((result) => {
      console.log(result);
    });
  }, 5000 * i);
}
