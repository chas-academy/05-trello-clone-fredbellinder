import $ from 'jquery';

require('webpack-jquery-ui');
import '../css/styles.css';
// $.getScript('widget.js');

$(function () {
  $.widget('fred.bgColorize', {
    options: {
      color1: 'red',
      color2: 'blue'
    },
    _create: function () {
      let color = this._selectColor();
      this.element.css({
        "backgroundColor": color
      }).fadeIn(1000)
        .addClass('fredColor');
    },

    _selectColor: function () {
      let color = [
        this.options.color1,
        this.options.color2
      ];
      let random = Math.floor(Math.random() * 3);
      console.log(random);
      return color[random];
    }
  });
});


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


    $(`<div class='dialog-div'>
        <div class="tabs-div">
        <ul>

        <li>
          <a href="#test">Test1</a>
        </li>
        <li>
        <a href="#test2">Test2</a>
      </li>
        </ul>
        <div id="test">
        <h1>TEST1</h1>
        </div>
        <div id="test2">
        <h1>TEST2</h1>
        </div>
        </div>
      </div>`).dialog({
      // modal: true,
      autoOpen: true
    }).tabs();
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
    $('.session-restore').on('click', render);
  }

  function listCounter() {
    let listLength = $('li.column').length;
    return listLength;
  }

  function setCardsSortable(classToSort) {
    let victim = classToSort;
    console.log('dragger')
    $(victim).sortable({
      update: function () { snapShot(); console.log('hello') },
      connectWith: classToSort,
      cursor: "pointer"
    });
  }

  function setListsSortable(classToSort) {
    let victim = classToSort;
    console.log('dragger')
    $(victim).sortable({
      update: function () { snapShot(); console.log('hello') },
      connectWith: classToSort,
    });
    $('.board1').droppable({
      update: function () { snapShot(); console.log('hello') },
      axis: 'x'
    });
  }


  function snapShot() {
    let abs = { data: document.body };
    // console.log(abs.data.innerHTML);
    localStorage.trellosession = abs.data.innerHTML;
  }


  /* ============== Metoder för att hantera listor nedan ============== */
  function createList(event) {

    //$('#list-creation-dialog :inpuzt')[0].value <--denna ska funka för addnewlistknappen sen, men inte enter-tryck :(
    event.preventDefault();
    let echoThis = $('input[name="listTitle"]').val();
    localStorage.setItem('freddans', echoThis);
    console.log(echoThis);
    let listCount = listCounter();
    if (listCount >= 3) {
      console.log('Maximum number of lists exceeded');
    } else {
      console.log(event);
      if (event != undefined) {
        event.preventDefault();
        let createEventList = echoThis;
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


    snapShot();
  }

  function deleteList() {
    $(this).closest('.column').fadeOut('slow', function () {
      $(this).closest('.column').remove();
      snapShot();
    });

  }

  /* =========== Metoder för att hantera kort i listor nedan =========== */
  function createCard(event) {
    event.preventDefault();
    console.log();
    let dateDate = $('input[name="date"]').val();
    console.log(dateDate);

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
    snapShot();

  }

  function deleteCard() {
    console.log("This should delete the card you clicked on");
    $(this).closest('li.card').remove();
    snapShot();

  }

  // Metod för att rita ut element i DOM:en
  function render() {
    event.preventDefault();
    let abs = { data: document.body };
    let compare = localStorage.trellosession;
    console.log(abs, compare);
    if (abs.data.innerHTML != compare) {
      $('body').html(localStorage.trellosession);
      bindEvents();
    } else {
      console.log('They are the same');
    }
    setCardsSortable('.list-cards');
    setListsSortable('div.column');
  }
  /* =================== Publika metoder nedan ================== */

  // Init metod som körs först
  function init() {
    // Förslag på privata metoder
    captureDOMEls();
    createTabs();
    // createDialogs();
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
  // jtrello.render();
  jtrello.init();
  // event.originalEvent.path[0].title.value
  // $('body').bgColorize();

});
