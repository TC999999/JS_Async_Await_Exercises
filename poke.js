const $poke_facts_div = $("#poke_facts_div");
const $get_poke_button = $("#get_poke_button");
let baseURL = "https://pokeapi.co/api/v2";

function threeRandInts(num) {
  let intArr = [];
  while (intArr.length < 3) {
    let new_num = Math.floor(Math.random() * num);
    if (!intArr.includes(new_num)) {
      intArr.push(new_num);
    }
  }
  return intArr;
}

async function getPokemonByCount(count) {
  let { data: res } = await axios.get(`${baseURL}/pokemon/?limit=${count}`);
  let randArr = threeRandInts(count);
  let threePokemon = [];
  for (let num of randArr) {
    threePokemon.push({
      name: res.results[num].name,
      url: res.results[num].url,
    });
  }
  return threePokemon;
}

async function getPokeDex() {
  let { data: res } = await axios.get(`${baseURL}/pokemon`);
  let total = res.count;
  let pokemon = await getPokemonByCount(total);
  return pokemon;
}

async function getInfo(obj, url) {
  let { data: info } = await axios.get(url);
  let sprite = info.sprites.front_default;
  obj["sprite"] = sprite;

  let { data: entry } = await axios.get(info.species.url);
  let entries = entry.flavor_text_entries;
  if (entries.length == 0) {
    obj["dex_entry"] = "No entries have been added for this Pokemon yet";
  } else {
    let english_entries = entries.filter(function (val) {
      return val.language.name == "en";
    });
    obj["dex_entry"] = english_entries[0].flavor_text;
  }
}

async function buttonPress() {
  $poke_facts_div.empty();
  $loading_msg = $('<h3 id="loading_msg">').text("LOADING...");
  $poke_facts_div.append($loading_msg);
  let pokemon = await getPokeDex();
  for (let obj of pokemon) {
    await getInfo(obj, obj["url"]);
  }
  $poke_facts_div.empty();

  for (let mon of pokemon) {
    let $mon_div = $(`<div class="poke-div" id="${mon.name}-div">`);
    let $mon_name = $(`<h3>`).text(mon.name);
    let $mon_sprite = $(
      `<img id="unknown-image" src="https://static.wikia.nocookie.net/pokemon-hangout/images/f/ff/20090709005535%21Spr_3r_000.png/revision/latest/thumbnail/width/360/height/360?cb=20180110232007">`
    );
    if (mon.sprite !== null) {
      $mon_sprite = $(`<img src="${mon.sprite}">`);
    }
    let $mon_entry = $(`<p>`).text(mon.dex_entry);
    $mon_div.append($mon_name);
    $mon_div.append($mon_sprite);
    $mon_div.append($mon_entry);
    $poke_facts_div.append($mon_div);
  }
}

$(document).ready(async function () {
  $get_poke_button.on("click", async function () {
    await buttonPress();
  });
});
