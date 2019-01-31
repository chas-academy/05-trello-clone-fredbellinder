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
  function createDialogs() { }

  /*
  *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
  *  createList, deleteList, createCard och deleteCard etc.
  */
  function bindEvents() {
    DOM.$newListForm.on('submit', jtrello.new_list);
    DOM.$deleteListButton.on('click', jtrello.del_list);

    DOM.$newCardForm.on('submit', jtrello.new_card);
    DOM.$deleteCardButton.on('click', jtrello.del_card);

    // ska bli droppable

    // $('body').droppable({
    //   drop: function () {
    //     console.log(`dropped on ${this}`);
    //   }
    // });

    // DOM.$cards.draggable({
    //   containment: "body",
    //   cursor: "pointer",
    //   scroll: false,
    //   // appendTo: "div.list",
    //   zIndex: 100
    // }); // ska bli draggable
    // DOM.$board.draggable();
    // $('.droppable-fit').droppable({
    //   tolerance: 'fit',
    //   drop: function(){

    //   },
    // });
    // $('*').draggable();

  }


  function setDroppable(num) {
    let victim = `div.list.list-${num}`
    // $(victim).sortable({
    // connectWith: 'li.card',
    // accept: "li.card",
    // tolerance: 'pointer',
    // drop: function (event, ui) {
    //   let direction = $('div ul').first().append(ui);
    //   console.log(this, ui, direction, event);
    // },
    // greedy: true

    // });
  }

  function setSortable(classToSort) {
    let victim = classToSort;
    console.log('dragger')
    $(victim).sortable({
      connectWith: classToSort,
      change: function (event, ui) { },
      // appendTo: this,
      // // helper: "parent",
      // revert: 'invalid',
      // revertDuration: 500,
      // // containment: ".list", //Begränsar dig till ett element
      // // appendTo: "li.card",
      cursor: "pointer",
      // scroll: false,
      // zIndex: 100
    });
  }

  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(event) {
    //$('#list-creation-dialog :input')[0].value <--denna ska funka för addnewlistknappen sen, men inte enter-tryck :(
    if (event != undefined) {
      console.log(event);
      event.preventDefault();
      let createEventList = event.originalEvent.path[0].title.value;
      console.log(createEventList, $('#list-creation-dialog :input'));
      let listTemplate =
        `<div class='column column-${uniquityCount}'>
        <div class='list list-${uniquityCount} '>
        <div class='list-header list-header-${uniquityCount}'>${createEventList}
        <button class='button delete delete-list-${uniquityCount}'>X
        </button>
        </div><ul class='list-cards list-cards-${uniquityCount}'>
        <li class='add-new'><form class='new-card new-card-${uniquityCount}' action='index.html'>
        <input type='text' name='title' placeholder='Please name the card' />
        <button class='button add add-${uniquityCount}' >Add new card
        </button>
        </form>
        </li>
        </ul>
        </div>
        </div>`;
      $(listTemplate).appendTo('div.board').fadeIn('slow');
      $('.list-header-' + uniquityCount + ' .delete-list-' + uniquityCount).on('click', jtrello.del_list);
      $(`form.new-card.new-card-${uniquityCount}`).on('submit', jtrello.new_card);
      $('button.delete-' + uniquityCount).on('click', jtrello.new_card);
      setSortable(`div.column`);
      uniquityCount++;
    } else {
      alert('Inga tomma fält');
    }

  }

  function deleteList() {
    $(this).closest('div.column').fadeOut('slow', function () {
      $(this).closest('div.column').remove();
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
      setSortable(`.list-cards`);
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
  jtrello.new_list([{ value: 'testing' }]);
  jtrello.new_list([{ value: 'testing' }]);
  jtrello.new_list([{ value: 'testing' }]);
  jtrello.new_list([{ value: 'testing' }]);

});
