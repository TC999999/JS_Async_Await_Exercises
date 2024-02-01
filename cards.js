const $back_of_deck = $("#back_of_deck");
const $deck_info = $("#deck_info");
const $draw_card_button = $("#draw_card_button");
const $shuffle_deck_button = $("#shuffle_deck_button");
const $drawn_card_images = $("#drawn_card_images");
const $draw_info = $("#draw_info");

class Deck {
  constructor() {
    this.baseURL = "https://deckofcardsapi.com/api/deck";
  }

  async getDeck() {
    let { data: res } = await axios.get(
      `${this.baseURL}/new/shuffle?deck_count=1`
    );

    this.deck_id = res.deck_id;
    this.remaining_cards = res.remaining;
    $deck_info.text(`${this.remaining_cards} cards left`);
  }

  async drawCard() {
    let { data: res } = await axios.get(
      `${this.baseURL}/${this.deck_id}/draw/?count=1`
    );
    let cards = res.cards;
    for (let card of cards) {
      let $new_card_image = $(
        `<img class="card" id=${card.code} src=${card.image}>`
      );
      $drawn_card_images.prepend($new_card_image);
      $draw_info.text(`You drew the ${card.value} of ${card.suit}`);
    }
    this.remaining_cards = res.remaining;
    $deck_info.text(`${this.remaining_cards} cards left`);
    if (this.remaining_cards == 0) {
      $back_of_deck.hide();
      $shuffle_deck_button.show();
      $draw_card_button.hide();
      setInterval(function () {
        $draw_info.text("");
      }, 3000);
    }
  }
  async shuffle() {
    let { data: res } = await axios.get(
      `${this.baseURL}/${this.deck_id}/shuffle/`
    );

    this.remaining_cards = res.remaining;
    $deck_info.text(`${this.remaining_cards} cards left`);
    $drawn_card_images.empty();
    $back_of_deck.show();
    $shuffle_deck_button.hide();
    $draw_card_button.show();
    $draw_info.text("");
  }
}

$(document).ready(function () {
  let deck = new Deck();
  deck.getDeck();

  $draw_card_button.on("click", function () {
    deck.drawCard();
  });

  $shuffle_deck_button.on("click", function () {
    deck.shuffle();
  });
});
