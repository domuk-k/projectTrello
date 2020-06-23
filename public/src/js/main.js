// import { header } from "./header.js"
import {
  Board
} from "./Board.js"
import {
  Card
} from "./Card.js"
import {
  List
} from "./List.js"
import {
  User
} from "./User.js"
import {
  fetchRequest
} from "./fetchRequest.js"

const $listNameBox = document.querySelector('.list-name-box');
const $mainWrapper = document.querySelector('.main-wrapper');
const $main = document.querySelector('main');


let lists = [];
let cards = [];

let cardShadow = {};
let cardContent = {};
let listShadow = {};
let listContent = {};
let dragTarget = '';

const offset = {
  x: 0,
  y: 0
}

// 리스트랜더
const renderList = () => {

  let html = '';
  lists.forEach(list => {
    html +=
      `<div  class="list-wrapper">
      <div id = "${list.id}" class="list" >
        <div class='list-content' draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
          <div class="list-header">
            <textarea class="list-header-name">${list.name}</textarea>
            <button class="remove-list-btn">x</button>
          </div>
          <ul class="list-container">
          </ul>

          <div class="card-add-box">
            <a class="open-add-mod-btn"><span>+</span>Add another card</a>
            <div class="card-add-mod" style="display: none;">
              <input class="card-name-box" type=" text" placeholder="enter a title for this card...">
              <div class="card-add-mod-btn">
                <button class="card-add-btn">Add Card</button>
                <a class="card-add-mod-close-btn">x</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  });
  $mainWrapper.innerHTML = html;
  html = '';

  if (cards.length) return;
  cards.forEach(card => {
    const targetList = document.querySelector(`#${card.list_id}`);
    targetList.firstElementChild.firstElementChild.nextElementSibling.innerHTML += `
    <li id = "${card.id}" class="card-box">
    <div class="card-shadow">
      <div class="card-content" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
        <a class="card" href="/c/jUKFKu6Q/5-df">${card.content}</a>
        <button class="card-remove-btn">x</button>
      </div>
    </div>
  </li>`;
  });
};
// 카드랜더
const renderCard = target => {
  let html = '';
  let _cards = [];
  _cards = cards.filter(card => card.list_id === target.id);
  const targetList = document.querySelector(`#${target.id}`);
  _cards.forEach(card => {
    html += `
    <li id = "${card.id}" class="card-box">
    <div class="card-shadow">
    <div class="card-content" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
      <a class="card" href="/c/jUKFKu6Q/5-df">${card.content}</a>
      <button class="card-remove-btn">x</button>
    </div>
    </div>
  </li>`;
  });
  targetList.firstElementChild.firstElementChild.nextElementSibling.innerHTML = html;
  html = '';
};
// 초기데이타 get
const getMainData = async () => {
  const responseLists = await fetchRequest.get('/lists');
  const listData = await responseLists.json();
  const responseCards = await fetchRequest.get('/cards');
  const cardData = await responseCards.json();
  lists = listData;
  cards = cardData;
};

// 이벤트 핸들러
const mainEventHandlers = {
  // 애드 모드로 전환
  closeAddMod(target) {
    target.parentNode.parentNode.style.display = 'none';
  },
  openAddMod(target) {
    target.nextElementSibling.style.display = 'block';
  },

  // 리스트 추가 제거
  addList(Name) {
    const generatedListId = () => (lists.length ? Math.max(...lists.map(list => list.id.replace(/[^0-9]/g, ''))) + 1 : 1);

    const list = new List(generatedListId(), Name);

    fetchRequest.post('/lists', list)
      .then(response => response.json())
      .then(_list => {
        lists = [...lists, _list]
      })
      .then(renderList)
      .catch(err => console.error(err));
  },
  removeList(id) {
    fetchRequest.delete(`/lists/${id}`)
      .then(lists = lists.filter(list => list.id !== id))
      .then(renderList)
      .catch(err => console.error(err));
    if (cards.length) {
      cards.filter(card => card.list_id === id).forEach(card => {
        fetchRequest.delete(`/cards/${card.id}`);
      });
      cards = cards.filter(card => card.list_id !== id);
    }
  },

  // 카드 추가 제거
  addCard(content, target) {
    const generatedCardId = () => (cards.length ? Math.max(...cards.map(card => card.id.replace(/[^0-9]/g, ''))) + 1 : 1);
    const card = new Card(generatedCardId(), content, target.id);
    fetchRequest.post('/cards', card)
      .then(response => response.json())
      .then(_card => {
        cards = [...cards, _card]
      })
      .then(() => renderCard(target))
      .catch(err => console.error(err));
  },
  removeCard(id, target) {
    fetchRequest.delete(`/cards/${id}`)
      .then(cards = cards.filter(card => card.id !== id))
      .then(() => renderCard(target))
      // .then(renderOnload)
      .catch(err => console.error(err));
  },

  // 카드 드래그
  dragCard(e) {
    // console.log('카드 드래그스타트');
    cardShadow = e.target.parentNode;
    cardContent = e.target;
    cardShadow.removeChild(cardContent)
    dragTarget = 0;
  },
  // 리스트 드래그
  dragList(e) {
    // console.log('리스트 드래그스타트', e.target);
    listShadow = e.target.parentNode;
    listContent = e.target;
    listShadow.style.height = `${listShadow.getBoundingClientRect().height}px`;
    listShadow.removeChild(listContent);
    dragTarget = 1;
  },
  dragEnterCard(e) {
    if (dragTarget === 0) {
      // console.log('카드 드래그엔터', e.target, e.currentTarget);
      if (e.target.className === 'list-header') e.target.nextElementSibling.firstElementChild.appendChild(cardShadow);
      if (e.target.className === 'card-box') e.target.parentNode.insertBefore(cardShadow, e.target);
      if (e.target.className === 'card-add-box') e.target.previousElementSibling.appendChild(cardShadow);
    }
    if (dragTarget === 1) {
      // console.log('리스트 드래그엔터', e.target);
      if (e.target.className === 'list') e.target.parentNode.parentNode.insertBefore(listShadow.parentNode, e.target.parentNode)
      if (e.target.className === 'list-wrapper') e.target.parentNode.insertBefore(listShadow.parentNode, e.target);
    }
  },
  dropCard() {
    if (dragTarget === 0) cardShadow.appendChild(cardContent);
    if (dragTarget === 1) {
      console.log('칠드랜', listShadow.parentNode.parentNode.children); 
      listShadow.appendChild(listContent);
      listShadow.style.height = 'auto';

      lists.forEach(list => fetchRequest.delete(`/lists/${list.id}`));

      let _lists = [];
      [...listShadow.parentNode.parentNode.children].forEach(listNode => {
        _lists = [..._lists, lists.find(list => list.id === listNode.firstElementChild.id)]
        console.log(_lists);
      });
      lists = _lists;
      console.log(_lists);
      console.log(lists);
      // fetchRequest.post('lists', lists)
      //   .catch(err => console.error(err));
      _lists = [];

    }
    cards = cards.filter(card => card.id !== cardContent.id);
  }
};

// 이벤트 바인딩
const mainEventBindings = () => {
  document.querySelector('main').onclick = ({
    target
  }) => {
    // console.log(target);
    if (target.matches('.add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    if (target.matches('.card-add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    if (target.matches('.open-add-mod-btn')) mainEventHandlers.openAddMod(target);
    if (target.matches('.remove-list-btn')) mainEventHandlers.removeList(target.parentNode.parentNode.parentNode.id);
    if (target.matches('.card-add-btn')) {
      if (!target.parentNode.previousElementSibling.value) return;
      mainEventHandlers.addCard(target.parentNode.previousElementSibling.value, target.parentNode.parentNode.parentNode.parentNode.parentNode);
      target.parentNode.previousElementSibling.value = '';
    }
    if (target.matches('.card-remove-btn')) mainEventHandlers.removeCard(target.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
  };

  // 버튼 클릭시 리스트 생성
  document.querySelector('.list-add-btn').onclick = () => {
    if (!$listNameBox.value) return;
    mainEventHandlers.addList($listNameBox.value.trim());
    $listNameBox.value = '';
  };

  // 인풋 입력시 리스트 생성
  $listNameBox.onkeyup = e => {
    if (!e.target === $listNameBox) return;
    const content = e.target.value.trim();
    if (e.keyCode !== 13 || content === '') return;
    mainEventHandlers.addList(content);
    e.target.value = '';
  };

  // 인풋 입력시 카드생성
  $mainWrapper.onkeyup = e => {
    if (!e.target.matches('.card-name-box')) return;
    const content = e.target.value.trim();
    if (e.keyCode !== 13 || content === '') return;
    mainEventHandlers.addCard(content, e.target.parentNode.parentNode.parentNode.parentNode);
    e.target.value = '';
  };

  // 드래그 이벤트
  $main.ondrag = e => {
    if (e.target.matches('.card-content')) mainEventHandlers.dragCard(e);
    if (e.target.matches('.list-content')) mainEventHandlers.dragList(e);
  };
  $main.ondragenter = e => {
    mainEventHandlers.dragEnterCard(e);
  };
  $main.ondragover = e => {
    e.preventDefault();
  };
  $main.ondrop = e => {
    // console.log('드랍', e.target, e.currentTarget);
    mainEventHandlers.dropCard();
  };

};


// 메인엔트리
// eslint-disable-next-line import/prefer-default-export
export const initMain = async () => {
  await getMainData();
  await renderList();
  mainEventBindings();
  // dragEvent();
};