const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ratingsFile = "ratings.json";

// Load existing ratings or create an empty object
let ratings = {};
try {
  const data = fs.readFileSync(ratingsFile);
  ratings = JSON.parse(data);
} catch (err) {
  if (err.code !== "ENOENT") {
    console.error("Error reading ratings file:", err);
  }
}

function saveRatings() {
  fs.writeFileSync(ratingsFile, JSON.stringify(ratings, null, 2));
}

function calculateNewRating(ratingA, ratingB, result) {
  const expectedScoreA = 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
  return ratingA + 32 * (result - expectedScoreA);
}

function updateRatings(playerA, playerB, result) {
  const ratingA = ratings[playerA] || 1500;
  const ratingB = ratings[playerB] || 1500;
  const newRatingA = calculateNewRating(ratingA, ratingB, result);
  const newRatingB = calculateNewRating(ratingB, ratingA, 1 - result);
  ratings[playerA] = newRatingA;
  ratings[playerB] = newRatingB;
  saveRatings();
  console.log(
    `New ratings: ${playerA} = ${newRatingA}, ${playerB} = ${newRatingB}`
  );
}

function promptForMatchResult() {
  rl.question("Enter player A name: ", (playerA) => {
    rl.question("Enter player B name: ", (playerB) => {
      rl.question(
        "Enter the result (0 for player A, 0.5 for draw, 1 for player B): ",
        (result) => {
          updateRatings(playerA, playerB, parseFloat(result));
          rl.close();
        }
      );
    });
  });
}

promptForMatchResult();
