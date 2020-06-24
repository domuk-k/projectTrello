// import { header } from "./header.js"
import { User, Board, Card, List } from "./constructors.js"


const $listNameBox = document.querySelector('.list-name-box');
const $mainWrapper = document.querySelector('.main-wrapper');
const $main = document.querySelector('main');


let lists = [];


let cardBox = {};
let cardShadow = {};
let cardContent = {};
let listShadow = {};
let listContent = {};
let dragTarget = '';

// 리스트랜더
const renderList = () => {
  // console.log(lists);

  let html = '';
  lists.forEach(list => {
    html +=
      `<div  class="list-wrapper">
      <div id="list-${list.id}" class="list" >
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

  lists.forEach(list => {
    if (!list.cards.length) return;
    list.cards.forEach(card => {
      const targetList = document.querySelector(`#list-${list.id}`);
      targetList.firstElementChild.firstElementChild.nextElementSibling.innerHTML += `
      <li id ="card-${card.id}" class="card-box">
        <div class="card-shadow">
          <div class="card-content" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
              <a class="card" href="/c/jUKFKu6Q/5-df">${card.card_name}</a>
              <button class="card-remove-btn">x</button>
            </div>
          </div>
        </li>`
    });
  });
};


// 통신
const dataMethod = {
  // 초기데이타 get
  async getMainData () {
    const responseLists = await axios.get(`/boards/1/lists`);
    const listData = await responseLists.data;
    lists = listData;
  },

  // 리스트 추가
  async addList(newList) {
    const response = await axios.post('/boards/1/lists', newList)
    const listData = await response.data
    lists = [...lists, listData]
    renderList();
  },
  // 리스트 제거
  async removeList(listId) {
    const response = await axios.delete(`boards/1/lists/${listId}`, { id: listId})
    const removedlists = await response.data
    lists = removedlists;
    renderList();
  },

  // 카드 추가
  async addCard(listId, newCard) {
    console.log(listId);
    const response = await axios.post(`/boards/1/lists/${listId}/cards`, newCard);
    const listsData = await response.data;
    lists = await listsData;
    renderList();
  },
  // 카드 제거
  async removeCard(listId, cardId) {
    const response = await axios.delete(`/boards/1/lists/${listId}/cards/${cardId}`);
    const _lists = await response.data;
    lists = _lists;
    renderList();
  },

  // 리스트 드래그 후 데이터 변환
  async afterListDragChangeData(_lists) {
    await axios.delete('/boards/1/lists/all');
    const response = await axios.post('/boards/1/lists/all', _lists);
    const listsData = await response.data;
    lists = listsData;
    console.log(lists);
    renderList();
  },
  // 카드 드래그 후 데이터 변환
  async afterCardDrangChangeData(_cards, listId) {
    await axios.delete(`/boards/1/lists/${listId}/cards/all`);
    const response = await axios.post(`/boards/1/lists/${listId}/cards/all`, _cards);
    const listsData = await response.data;
    lists = listsData;
    console.log(lists);
    renderList();
  }
}


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
  addList(listName) {
    const generatedListId = () => (lists.length ? Math.max(...lists.map(list => list.id)) + 1 : 1);
    const newList = new List(generatedListId(), listName);
    dataMethod.addList(newList);
  },
  removeList(listId) {
    const id = +listId.split('-')[1];
    dataMethod.removeList(id);
  },

  // 카드 추가 제거
  addCard(cardName, _listId) {
    const listId = +_listId.split('-')[1];
    let cardsAll = [];
    let cardsArray = [];
    console.log(cardsAll);
    console.log(lists.map(list => list.cards));
    
    lists.forEach(list => { 
      cardsArray = list.cards;
      cardsAll = [...cardsAll, ...cardsArray]
    });
    // console.log(lists.map(list => list.cards));
    
    const generatedCardId = () => (cardsAll.length ? Math.max(...cardsAll.map(card => card.id)) + 1 : 1);
    const newCard = new Card(generatedCardId(), cardName, listId);
    dataMethod.addCard(listId, newCard)
  },
  removeCard(_cardId, _listId) {
    let cardId = _cardId.split('-')[1];
    let listId = _listId.split('-')[1];
    dataMethod.removeCard(listId, cardId);
  },

  // 카드 드래그
  dragCard(e) {
    // console.log('카드 드래그스타트');
    cardBox = e.target.parentNode.parentNode;
    cardShadow = e.target.parentNode;
    cardContent = e.target;
    cardShadow.removeChild(cardContent)
    dragTarget = 'card';

    const listId = cardShadow.parentNode.parentNode.parentNode.parentNode.id;
    const cardId = cardShadow.parentNode.id;
    dataMethod.removeCard(cardId, listId)
  },
  // 리스트 드래그
  dragList(e) {
    // console.log('리스트 드래그스타트', e.target);
    listShadow = e.target.parentNode;
    listContent = e.target;
    listShadow.style.height = `${listShadow.getBoundingClientRect().height}px`;
    listShadow.removeChild(listContent);
    dragTarget = 'list';
  },
  dragEnterCard(e) {
    if (dragTarget === 'card') {
      // console.log('카드 드래그엔터', e.target, e.currentTarget);
      if (e.target.className === 'list-header') {
        e.target.nextElementSibling.firstElementChild.appendChild(cardBox);
      }
      if (e.target.className === 'card-box') {
        e.target.parentNode.insertBefore(cardBox, e.target);
        e.target.parentNode.insertBefore(cardBox, e.target);
      }
      if (e.target.className === 'card-add-box') e.target.previousElementSibling.appendChild(cardBox);
    }
    if (dragTarget === 'list') {
      // console.log('리스트 드래그엔터', e.target);
      if (e.target.className === 'list') e.target.parentNode.parentNode.insertBefore(listShadow.parentNode, e.target.parentNode)
      if (e.target.className === 'list-wrapper') e.target.parentNode.insertBefore(listShadow.parentNode, e.target);
    }
  },
  dropCard() {
    if (dragTarget === 'card') {
      cardShadow.appendChild(cardContent);
      const listId = cardShadow.parentNode.parentNode.parentNode.id.split('-')[1];
      
      let cardss = lists[lists.findIndex(list => list.id === +listId)].cards;
      let _cards = [];
      
      console.log(cardShadow.parentNode.children);
      
      
      [...cardShadow.parentNode.children].forEach(cardNode => {
        _cards = [..._cards, cardss.find(_card => _card.id === +cardNode.parentNode.id.split('-')[1])];
      });
      console.log(_cards);
      
      dataMethod.afterCardDrangChangeData(_cards, listId);

    }

    if (dragTarget === 'list') {
      listShadow.appendChild(listContent);
      listShadow.style.height = 'auto';


      let _lists = [];
      [...listShadow.parentNode.parentNode.children].forEach(listNode => {
        _lists = [..._lists, lists.find(_list => _list.id === +listNode.firstElementChild.id.split('-')[1])];
      });

      dataMethod.afterListDragChangeData(_lists);
    }
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
      mainEventHandlers.addCard(target.parentNode.previousElementSibling.value, target.parentNode.parentNode.parentNode.parentNode.parentNode.id);
      target.parentNode.previousElementSibling.value = '';
    }
    if (target.matches('.card-remove-btn')) mainEventHandlers.removeCard(target.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
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
    const listName = e.target.value.trim();
    if (e.keyCode !== 13 || listName === '') return;
    mainEventHandlers.addList(listName);
    e.target.value = '';
  };

  // 인풋 입력시 카드생성
  $mainWrapper.onkeyup = e => {
    if (!e.target.matches('.card-name-box')) return;
    const cardName = e.target.value.trim();
    if (e.keyCode !== 13 || cardName === '') return;
    mainEventHandlers.addCard(cardName, e.target.parentNode.parentNode.parentNode.parentNode.id);
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
  await dataMethod.getMainData();
  await renderList();
  mainEventBindings();
  // dragEvent();
};