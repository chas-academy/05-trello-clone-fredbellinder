import $ from 'jquery';

require('webpack-jquery-ui');
import '../css/styles.css';
// import { spawn } from 'child_process';
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
            });
        },

        _selectColor: function () {
            let color = [
                this.options.color1,
                this.options.color2
            ];
            let random = Math.floor(Math.random() * 3);
            // console.log(random);
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
    // let elementToEdit
    let elementToRender;

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
    function bindEvents() {
        // $('.edit-btn-card').off().on('click', function () {
        //     editCard(elementToEdit);
        // });
        // $('.edit-btn-list').off().on('click', function () {
        //     editList(elementToEdit);
        // });
        $('a.edit-close-dialog').off().on('click', function () {
            toggleDialog();
            // elementToEdit = this;
            // console.log(elementToEdit);
        });
        $('div.list-content').off().on('click', function () {
            DOM.$elementToEdit = $(this);
            console.log(DOM.$elementToEdit);
            elementToRender = DOM.$elementToEdit.children('div > span.list-title').text().trim();
            $('span.ui-dialog-title').text(`Edit List ${elementToRender}`);
            createDialogs();
            toggleDialog();
            editListsAndCards(DOM.$elementToEdit, 'list');
        })
        $('div.card-content').off().on('click', function () {
            DOM.$elementToEdit = $(this);
            console.log(DOM.$elementToEdit);
            elementToRender = DOM.$elementToEdit.children('div > span.card-title').text().trim();
            $('span.ui-dialog-title').text(`Edit card: ${elementToRender}`);
            createDialogs();
            toggleDialog();
            editListsAndCards(DOM.$elementToEdit, 'card');
        });

        // $('input.toggle-snapshot').('click', function () {});

        DOM.$newListForm.off().on('submit', jtrello.new_list);
        DOM.$deleteListButton.off().on('click', jtrello.del_list);
        DOM.$newCardForm.off().on('submit', jtrello.new_card);
        DOM.$deleteCardButton.off().on('click', jtrello.del_card);
        $('.session-restore').off().on('click', jtrello.render);
        // $('.card').off().on('click', $('#dialog').toggle('option'));
    }

    function createTabs() { }

    function createDialogs() {
        console.log('createDialogs');
        $(`<div id="dialog" class='dialog-div' title="Edit ${DOM.$elementToEdit}">
        <div class="tabs-div">
        <ul>
        <li>
          <a href="#edit-title">Edit Title</a>
        </li>
        <li>
        <a href="#edit-due-date">Edit Due Date</a>
        </li>
        </ul>
        <div id="edit-title">
        <h3>Edit Title</h3>
        <form>
        <input type="text" name="edit-title" placeholder="Enter Title" required/>
        <button class="edit-btn-title">Save</button>
        </form>
        <a class="edit-close-dialog" href="javascript:;"><small>Close</small></a>
        </div>
        <div id="edit-due-date">
        <h3> Due Date Edit</h3>
        <form>
        <input type='text' name='edit-date' class='datepicker-input-date' placeholder="Pick date from calendar" required/>
        <button class="edit-btn-date">Save</button>
        </form>
        <a class="edit-close-dialog" href="javascript:;"><small>Close</small></a>
        </div>
        </div>
      </div>`).dialog({
            modal: false,
            autoOpen: false,
            closeText: 'X',
            hide: false
        }).tabs();
        $(function () {
            $("input.datepicker-input-date").datepicker();
        });
        captureDOMEls();
        bindEvents();
    }

    /*
    *  Denna metod kommer nyttja variabeln DOM för att binda eventlyssnare till
    *  createList, deleteList, createCard och deleteCard etc.
    */

    function toggleDialog() {
        console.log('toggleDialog')
        let status = $("#dialog").dialog("isOpen");
        if (status) {
            $("#dialog").dialog('close');
        } else {
            $("#dialog").dialog('open');
        }
    }

    function listCounter() {
        let listLength = $('li.column').length;
        return listLength;
    }

    function setCardsSortable(classToSort) {
        let victim = classToSort;
        $(victim).sortable({
            update: function () { snapShot(); console.log('hello'); },
            connectWith: classToSort,
            cursor: "pointer",
            dropOnEmpty: true
        });
    }

    function setListsSortable() {
        $('.board1').sortable({
            update: function () { snapShot(); console.log('hello') },
            axis: 'x'
        });
    }





    /* ============== Metoder för att hantera listor nedan ============== */
    function createList(event) {

        //$('#list-creation-dialog :inpuzt')[0].value <--denna ska funka för addnewlistknappen sen, men inte enter-tryck :(
        event.preventDefault();
        let echoThis = $('input[name="listTitle"]').val() || 'untitled';
        let listCount = listCounter();
        if (listCount >= 3) {
            console.log('Maximum number of lists exceeded');
        } else {
            if (event != undefined) {
                event.preventDefault();
                // console.log(createEventList, $('#list-creation-dialog :input'));
                let listTemplate =
                    `<li class='column sortlist column-${uniquityCount}'>
        <div class='list list-${uniquityCount} '>
        <div class='list-header list-header-${uniquityCount}'><div class="list-content">
        <div>
        <span class="list-title">${echoThis}
        </span>
        </div>
        <div class="list-date-div">
        <span class="list-date">
        </span>
        </div></div><button class='button delete delete-list delete-list-${uniquityCount}'>X
        </button>
        </div><ul class='list-cards list-cards-${uniquityCount}'>
        <li class='add-new'>
        <form class='new-card new-card-${uniquityCount}' action='index.html'>
        <input type='text' name='title' placeholder='Please name the card' />
        <input type='text' name='pickedDate' class='datepicker-input'>
        <button class='button add add-${uniquityCount}' >Add new card
        </button></form></li></ul></div></li>`;
                $(listTemplate).appendTo('ul.board1');
                // $('.list-header-' + uniquityCount + ' .delete-list-' + uniquityCount).off().on('click', jtrello.del_list);
                // $('button.delete-' + uniquityCount).off().on('click', jtrello.new_card);
                setListsSortable();
                setCardsSortable();
                uniquityCount++;
            } else {
                alert('Inga tomma fält');
            }

            $(function () {
                $(".datepicker-input").datepicker();
            });
        }
        captureDOMEls();
        bindEvents();
        snapShot();
        createDialogs();
        setCardsSortable('.list-cards');
        $('input[name="listTitle"]').val('');
    }

    function deleteList() {
        $("#dialog").dialog('close');
        $(this).closest('.column').fadeOut('slow', function () {
            $(this).closest('.column').remove();
        });
        snapShot();
    }

    /* =========== Metoder för att hantera kort i listor nedan =========== */
    function createCard(event) {
        event.preventDefault();
        var cardTitleRaw = $(this).children('input[name="title"]').val();
        let cardDate = $(this).children('input[name="pickedDate"]').val();

        let cardTitle = $($.parseHTML(cardTitleRaw)).text().trim();
        let cardTemplate = `<li class='card card-${uniquityCount}'><div class="card-content"><div><span class="card-title">${cardTitle}</span></div><div class="card-date-div"><span class="card-date">${cardDate}</span></div></div><button class='button delete button-${uniquityCount}'>X</button>`
        if (cardTitle) {
            $(this).closest('ul.list-cards').prepend(cardTemplate);
            // $(`.button-${uniquityCount}`).off().on('click', deleteCard);
            setCardsSortable(`.list-cards`);
        } else {
            console.log('Här ska det komma upp en go\' banner eller nåt som säger: Empty Card names, nej det går inte!');
        }
        uniquityCount++;
        snapShot();
        captureDOMEls();
        bindEvents();
        $('input[name="pickedDate"]').val('');
        $('input[name="title"]').val('');
    }

    function deleteCard() {
        console.log("This should delete the card you clicked on");
        $(this).closest('li.card').remove();
        $("#dialog").dialog('close');
        snapShot();

    }

    // Metod för att rita ut element i DOM:en
    function snapShot() {
        let state = $('input.toggle-snapshot:checked').length;
        console.log(state);
        if (state) {
            let body = { data: document.body };
            // console.log(abs.data.innerHTML);
            localStorage.trellosession = body.data.innerHTML;
        }

    }

    function render() {
        event.preventDefault();
        let abs = { data: document.body };
        let compare = localStorage.trellosession;
        // console.log(abs, compare);
        if (abs.data.innerHTML != compare) {
            $('body').html(localStorage.trellosession);
        } else {
            console.log('They are the same');
        }
        // captureDOMEls();
        // setCardsSortable('.list-cards');
        // setListsSortable();
        // createDialogs();
        // bindEvents();
    }

    function editListsAndCards(element, token) {
        // event.preventDefault();
        // console.log('ELAC: ' + element);
        let tester = $(element).children();
        let testerChildren = $(tester).children();
        console.log('freddans', tester, testerChildren);

        $('button.edit-btn-title').off().on('click', function () {
            event.preventDefault();
            let title = $('input[name="edit-title"]').val();
            testerChildren.first().text(title);
        });
        $('button.edit-btn-date').off().on('click', function () {
            event.preventDefault();
            let date = $('input[name="edit-date"]').val();
            testerChildren.last().text(date);
        });

    }


    // function editList() {
    //     event.preventDefault();
    //     let title = $('input[name="edit-title"]').val();
    //     console.log(title);
    // }
    /* =================== Publika metoder nedan ================== */

    // Init metod som körs först
    function init() {
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
    // jtrello.render();
    jtrello.init();
    // event.originalEvent.path[0].title.value
    $('div.list').bgColorize();

});
