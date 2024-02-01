const $my_fav_list = $("#my_fav_list");
const $three_random_list = $("#three_random_list");
const $user_fav_list = $("#user_fav_list");
const $user_favorite_input = $("#user_favorite_input");
const $submit_user_favorite = $("#submit_user_favorite");

async function getFavNumberFact() {
  let baseURL = "http://numbersapi.com";
  let { data: numFact } = await axios.get(`${baseURL}/42?json`);

  let $new_fact = $("<li>").text(numFact.text);
  $my_fav_list.append($new_fact);
}

async function getThreeRandomFacts() {
  let baseURL = "http://numbersapi.com";
  let numFacts = await Promise.all([
    axios.get(`${baseURL}/random?json`),
    axios.get(`${baseURL}/random?json`),
    axios.get(`${baseURL}/random?json`),
  ]);
  for (let fact of numFacts) {
    let $new_fact = $("<li>").text(fact.data.text);
    $three_random_list.append($new_fact);
  }
}

async function getFourFavFacts(num) {
  let baseURL = "http://numbersapi.com";
  let numFacts = await Promise.all([
    axios.get(`${baseURL}/${num}?json`),
    axios.get(`${baseURL}/${num}?json`),
    axios.get(`${baseURL}/${num}?json`),
    axios.get(`${baseURL}/${num}?json`),
  ]);
  for (let fact of numFacts) {
    let $new_fact = $("<li>").text(fact.data.text);
    $user_fav_list.append($new_fact);
  }
}

$(document).ready(function () {
  getFavNumberFact();
  getThreeRandomFacts();
});

$submit_user_favorite.on("click", function () {
  $user_fav_list.empty();
  $num = $user_favorite_input.val();

  if ($num.length == 0) {
    let $empty_val = $("<li>").text("PLEASE INPUT A NUMBER");
    $user_fav_list.append($empty_val);
  } else {
    getFourFavFacts($num);
  }
});
