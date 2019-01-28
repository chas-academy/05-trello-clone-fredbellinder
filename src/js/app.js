import $ from 'jquery';

require('webpack-jquery-ui');
import '../css/styles.css';

/**
 * jtrello
 * @return {Object} [Publikt tillgänliga metoder som vi exponerar]
 */

// Här tillämpar vi mönstret reavealing module pattern:
// Mer information om det mönstret här: https://bit.ly/1nt5vXP
const jtrello = (function () {
  "use strict"; // https://lucybain.com/blog/2014/js-use-strict/

  // Referens internt i modulen för DOM element
  let DOM = {};

  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');

    DOM.$newListButton = $('button#new-list');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.card > button.delete');
  }

  function createTabs() { }
  function createDialogs() { }

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$newListButton.on('click', createList);
    DOM.$deleteListButton.on('click', deleteList);

    DOM.$newCardForm.on('submit', createCard);
    DOM.$deleteCardButton.on('click', deleteCard);
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList() {
    event.preventDefault();
    console.log("This should create a new list");
    let listTemplate = "<div class='column'><div class='list'><div class='list-header'>Done<button class='button delete'>X</button></div><ul class='list-cards'><li class='card'>Card #3<button class='button delete'>X</button></li><li class='add-new'><form class='new-card' action='index.html'><input type='text' name='title' placeholder='Please name the card' /><button class='button add'>Add new card</button></form></li></ul></div></div>";
    $('div.board').append(listTemplate);
    // .append(listTemplate);
  }

  function deleteList() {
    console.log("This should delete the list you clicked on");
    $(this).closest('div.list').remove();
  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    $(this).closest('ul.list-cards').prepend("<li class='card'>" + event.originalEvent.path[0].title.value + "<button class='button delete'>X</button>");
    let deleteCardButton = $(this).addClass('eventClass');
    $('button.eventClass').on('click', deleteCard);
    deleteCardButton.removeClass('eventClass');
  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
    $(this).closest('li.card').remove();
  }

  // Metod för att rita ut element i DOM:en
  function render() {

  }
  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    console.log(':::: Initializing JTrello :::: FROM APPJS');
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    createDialogs();

    bindEvents();
  }

  // All kod här
  return {
    init: init
  };
})();

//usage
$("document").ready(function () {
  jtrello.init();
});
