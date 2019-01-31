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
  let uniquityCount = 0;


  /* =================== Privata metoder nedan ================= */
  function captureDOMEls() {
    DOM.$board = $('.board');
    DOM.$listDialog = $('#list-creation-dialog');
    DOM.$columns = $('.column');
    DOM.$lists = $('.list');
    DOM.$cards = $('.card');

    DOM.$newListForm = $('.new-list-form');
    DOM.$deleteListButton = $('.list-header > button.delete');

    DOM.$newCardForm = $('form.new-card');
    DOM.$deleteCardButton = $('.card > button.delete');
  }

  function createTabs() { }
  function createDialogs() {

  }

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$newListForm.on('submit', jtrello.new_list);
    DOM.$deleteListButton.on('click', jtrello.del_list);

    DOM.$newCardForm.on('submit', jtrello.new_card);
    DOM.$deleteCardButton.on('click', jtrello.del_card);
  }

  function listCounter() {
    let listLength = $('li.column').length;
    return listLength;
  }

  function setCardsSortable(classToSort) {
    let victim = classToSort;
    console.log('dragger')
    $(victim).sortable({
      connectWith: classToSort,
      cursor: "pointer"
    });
  }

  function setListsSortable(classToSort) {
    let victim = classToSort;
    console.log('dragger')
    $(victim).sortable({
      connectWith: classToSort,
    });
  }

  $('.board1').sortable({
    axis: 'x'
  })


  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(event) {
    //$('#list-creation-dialog :inpuzt')[0].value <--denna ska funka för addnewlistknappen sen, men inte enter-tryck :(
    event.preventDefault();
    let listCount = listCounter();
    if (listCount >= 3) {
      console.log('Maximum number of lists exceeded');
    } else {
      console.log(event);
      if (event != undefined) {
        event.preventDefault();
        let createEventList = event.originalEvent.path[0].title.value;
        // console.log(createEventList, $('#list-creation-dialog :input'));
        let listTemplate =
          `<li class='column sortlist column-${uniquityCount}'>
      <div class='list list-${uniquityCount} '>
        <div class='list-header list-header-${uniquityCount}'>${createEventList}
        <button class='button delete delete-list-${uniquityCount}'>X
        </button>
        </div><ul class='list-cards list-cards-${uniquityCount}'>
        <li class='add-new'>
        <form class='new-card new-card-${uniquityCount}' action='index.html'>
        <input type='text' name='title' placeholder='Please name the card' />
        <input type='text' name='date' class='datepicker-input'>
        <button class='button add add-${uniquityCount}' >Add new card
        </button>
        </form>
        </li>
        </ul>
        </div>
        </li>`;
        $(listTemplate).appendTo('ul.board1');
        $('.list-header-' + uniquityCount + ' .delete-list-' + uniquityCount).on('click', jtrello.del_list);
        $(`form.new-card.new-card-${uniquityCount}`).on('submit', jtrello.new_card);
        $('button.delete-' + uniquityCount).on('click', jtrello.new_card);
        setListsSortable('div.column');
        uniquityCount++;
      } else {
        alert('Inga tomma fält');
      }

      $(function () {
        $(".datepicker-input").datepicker();
      });
    }

  }

  function deleteList() {
    $(this).closest('.column').fadeOut('slow', function () {
      $(this).closest('.column').remove();
    });

  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    console.log();

    let eventValue = $($.parseHTML(event.originalEvent.path[0].title.value)).text().trim();
    let cardTemplate = `<li class='card card-${uniquityCount}'>${eventValue}<button class='button delete button-${uniquityCount}'>X</button>`
    if (eventValue) {
      $(this).closest('ul.list-cards').prepend(cardTemplate);
      $('.button-' + uniquityCount).on('click', deleteCard);
      setCardsSortable(`.list-cards`);
    } else {
      console.log('Här ska det komma upp en go\' banner eller nåt som säger: Empty Card names, nej det går inte!');
    }

    uniquityCount++;
  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
    $(this).closest('li.card').remove();
  }

  // Metod för att rita ut element i DOM:en
  function render() {
    let isUpdated = Math.floor(1000 * Math.random())
    console.log(isUpdated);
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
    init: init,
    render: render,
    new_list: createList,
    del_list: deleteList,
    new_card: createCard,
    del_card: deleteCard,

  };
})();


//usage
$("document").ready(function () {
  jtrello.render();
  jtrello.init();
  // event.originalEvent.path[0].title.value

});
