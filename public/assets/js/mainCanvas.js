import { state } from "./board.js"
import { User, Board, Card, List } from "./constructors.js"
import { refreshActivityLog } from './event_bindings.js'


const $listNameBox = document.querySelector('.list-name-box');
const $mainWrapper = document.querySelector('.main-wrapper');
const $main = document.querySelector('main');
const $modalWrapper = document.querySelector('.modal-wrapper');


let lists = [];


let cardBox = {};
let cardShadow = {};
let cardContent = {};
let listBox = {};
let listShadow = {};
let listContent = {};
let dragTarget = '';
let dragCard = {};
let cardsAfterDrag = [];

let isdrag = false;
let offset = {x:0,y:0}
let pos = {x:0,y:0}

// 리스트랜더
const renderList = () => {
  console.log(lists);

  let html = '';
  lists.forEach(list => {
    if (list !== 'null') {
      html +=
        `<div  class="list-wrapper">
      <div id="list-${list.id}" class="list" >
        <div class='list-content' draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
          <div class="list-header">
            <div class="list-header-name">${list.name}</div>
            <input class="list-header-name-input" value="${list.name}" autofocus>
            <button class="remove-list-btn">x</button>
          </div>
          <ul class="list-container">
          </ul>

          <div class="card-add-box">
            <a class="list-open-add-mod-btn"><span>+</span>Add another card</a>
            <div class="card-add-mod" style="display: none;">
              <input class="card-name-box" type=" text" placeholder="enter a title for this card..." autofocus>
              <div class="card-add-mod-btn">
                <button class="card-add-btn">Add Card</button>
                <a class="card-add-mod-close-btn">x</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    }
  });

  $mainWrapper.innerHTML = html;
  html = '';

  lists.forEach(list => {
    if (!list.cards.length) return;
    list.cards.forEach(card => {
      if (card !== null) {
        const targetList = document.querySelector(`#list-${list.id}`);
        targetList.firstElementChild.firstElementChild.nextElementSibling.innerHTML += `
      <li id ="card-${card.id}" class="card-box">
        <div class="card-shadow">
          <div class="card-content" draggable="true" ondragstart="event.dataTransfer.setData('text/plain',null)">
              <button class="card" href="/c/jUKFKu6Q/5-df">${card.card_name}</button>
              <button class="card-remove-btn">x</button>
            </div>
          </div>
        </li>`
      }
    });
  });
};
// 모달랜더
const renderModal = ( listData, cardData ) => {

  $modalWrapper.innerHTML = 
  ` 
  <div id="modal-${listData.id}-${cardData.id}" class="modal-box">
    <div class="modal-header">
      <h2 class="modal-card-head">${cardData.card_name}</h2>
      <input type="text" class="modal-card-name-input" value="${cardData.card_name}">
      <span class="modal-list-name">'${state.currentBoard.board_name}'보드, '${listData.name}'리스트의 카드입니다.</span>
      <span>created ${cardData.date_created}</span>
    </div>
    <div class="modal-description">
      <h2 class="modal-description-head">Description</h2>
      <a class="modal-description-content">${cardData.description}</a>
      <div class="modal-edit-mod" style="display: none;">
          <input type="text" class="modal-description-input">
          <div class="description-edit-mod-btn">
            <button class="descripton-edit-btn">Save</button>
            <a class="description-edit-close-btn">x</a>
          </div>
        </div>  
      </div>
    <div class="card-activity">
      <h2 class="card-activity-head">Activity</h2>
      <ul class="activity-box">
      </ul>
    </div>
    <button class="modal-close-btn">x</button>
  </div>
` 
  let html = '';
  const _activities = state.activities;
  _activities.reverse().forEach(activity => {
    if (activity.local === `card-${cardData.id}`) {

      html += `
      <li><span class="log-name">${activity.name}님이 </span>
      <span class="log-act">${activity.act}</span>했습니다.
       </li>
      `
    }
  });
  
  $modalWrapper.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.innerHTML = html;
};

// refreshActivityLog({
//   name: state.user.full_name,
//   act: `카드를 제거`,
//   local: `card-${cardId}`
// })


// 통신
const dataMethod = {
  // 초기데이타 get
  async getMainData() {
    const responseLists = await axios.get(`/boards/${state.currentBoard.id}/lists`);
    const listData = await responseLists.data;
    lists = listData;
  },

  // 리스트 추가
  async addList(newList) {
    const response = await axios.post(`/boards/${state.currentBoard.id}/lists`, newList)
    const listData = await response.data
    lists = [...lists, listData]
    renderList();
    refreshCardActivityLog({
      name: state.user.full_name,
      act: `리스트를 추가`,
      local: `list-${newList.id}`
    })
  },
  // 리스트 제거
  async removeList(listId) {
    const response = await axios.delete(`boards/${state.currentBoard.id}/lists/${listId}`, { id: listId })
    const removedlists = await response.data
    lists = removedlists;
    renderList();
    refreshActivityLog({
      name: state.user.full_name,
      act: `리스트를 제거`,
      local: `list-${listId}`
    })
  },
  // 리스트 네임 패치
  async patchListName(listName, listId) {
    const response = await axios.patch(`boards/${state.currentBoard.id}/lists/${listId}/list_name`, { name: listName })
    const listsData = await response.data
    lists = listsData;
    renderList();
    refreshActivityLog({
      name: state.user.full_name,
      act: `리스트 이름 변경`,
      local: `list-${listId}`
    })
  },

  // 카드 추가
  async addCard(listId, card) {
    console.log(listId);
    const response = await axios.post(`/boards/${state.currentBoard.id}/lists/${listId}/cards`, card);
    const listsData = await response.data;
    lists = await listsData;
    renderList();
    refreshActivityLog({
      name: state.user.full_name,
      act: `${card.card_name} 카드를 ${state.currentBoard.lists.find(list => list.id === listId).name} 리스트에 추가 `,
      local: `card-${card.id}`
    })
  },
  // 카드 제거
  async removeCard(listId, cardId) {
    const response = await axios.delete(`/boards/${state.currentBoard.id}/lists/${listId}/cards/${cardId}`);
    const _lists = await response.data;
    lists = _lists;
    renderList();
    refreshActivityLog({
      name: state.user.full_name,
      act: `카드를 제거`,
      local: `card-${cardId}`
    })
  },
  // 카드 네임 패치
  async patchCardName(listId, cardId, cardName) {
    await axios.patch(`boards/${state.currentBoard.id}/lists/${listId}/cards/${cardId}/card_name`, { card_name: cardName })
    refreshActivityLog({
      name: state.user.full_name,
      act: `카드이름 변경`,
      local: `card-${cardId}`
    })
    await dataMethod.getModalData(listId, cardId)
   
  },
  // 드래그 후 카드 추가
  async addDragCard(listId, card) {
    const responseCards = await axios.post(`/boards/${state.currentBoard.id}/lists/${listId}/cards/drag`, card);
    const cardsData = await responseCards.data;
    cardsAfterDrag = await cardsData;

    let _cards = [];
    console.log(cardsAfterDrag);

    [...cardBox.parentNode.children].forEach(cardNode => {
      _cards = [..._cards, cardsAfterDrag.find(_card => _card.id === +cardNode.id.split('-')[1])];
    });
    console.log(_cards);

    // await dataMethod.afterCardDrangChangeData(_cards, listId);
    await axios.delete(`/boards/${state.currentBoard.id}/lists/${listId}/cards/all`);
    const response = await axios.post(`/boards/1/lists/${listId}/cards/all`, _cards);
    const listsData = await response.data;
    lists = await listsData;
    renderList();


  },
  // 드래그 후 카드 제거
  async removeDragCard(listId, cardId) {
    const response = await axios.delete(`/boards/${state.currentBoard.id}/lists/${listId}/cards/${cardId}/drag`);
    const _card = await response.data;
    dragCard = _card;
  },

  // 리스트 드래그 후 데이터 변환
  async afterListDragChangeData(_lists) {
    await axios.delete(`/boards/${state.currentBoard.id}/lists/all`);
    const response = await axios.post(`/boards/${state.currentBoard.id}/lists/all`, _lists);
    const listsData = await response.data;
    lists = await listsData;
    renderList();
  },
  // 카드 드래그 후 데이터 변환
  async afterCardDrangChangeData(_cards, listId) {
    await axios.delete(`/boards/${state.currentBoard.id}/lists/${listId}/cards/all`);
    const response = await axios.post(`/boards/${state.currentBoard.id}/lists/${listId}/cards/all`, _cards);
    const listsData = await response.data;
    lists = await listsData;
    renderList();
  },

  // 모달 카드 데이터 겟
  async getModalData(listId, cardId) {
    
    const responseList = await axios.get(`/boards/${state.currentBoard.id}/lists/${listId}`);
    const listData = await responseList.data;
    const responseCard = await axios.get(`/boards/${state.currentBoard.id}/lists/${listId}/cards/${cardId}`);
    const cardData = await responseCard.data;
    
    renderModal(listData, cardData);
  },
  // 카드 디스크립션 변경
  async patchDescriptionContent(listId, cardId, content) {
    await axios.patch(`boards/${state.currentBoard.id}/lists/${listId}/cards/${cardId}/description`, { description: content })
    refreshActivityLog({
      name: state.user.full_name,
      act: '카드 description 변경',
      local: `card-${cardId}`
    });
  
    await dataMethod.getModalData(listId, cardId)
  
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
    target.parentNode.parentNode.firstElementChild.click();
  },

  // 리스트 네임 변환창 오픈
  openListNameInput(target) {
    target.style.display = 'none';
    target.nextElementSibling.style.display = 'block';
    target.nextElementSibling.select();
  },
  // 리스트 네임 변환창 닫기
  closeListNameInput(target) {
    target.style.display = 'none';
    target.previousElementSibling.style.display = 'block';
  },
  // 디스크립션 변환창 닫기
  closeDescriptionContentInput(target) {
    target.parentNode.display = 'none'
  },


  // 리스트 네임 변경
  patchListName(listName, listId) {
    const _listId = +listId.split('-')[1];
    dataMethod.patchListName(listName, _listId);
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

    lists.forEach(list => {
      cardsArray = list.cards;
      cardsAll = [...cardsAll, ...cardsArray]
    });

    const generatedCardId = () => (cardsAll.length ? Math.max(...cardsAll.map(card => card.id)) + 1 : 1);
    const newCard = new Card(generatedCardId(), cardName, listId);
    dataMethod.addCard(listId, newCard)
  },
  removeCard(_cardId, _listId) {
    const cardId = _cardId.split('-')[1];
    const listId = _listId.split('-')[1];
    dataMethod.removeCard(listId, cardId);
  },
  // 카드 이름 변경
  patchCardName(modalId, cardName) {
    console.log('카드네임 변경');
    
    const listId = +modalId.split('-')[1];
    const cardId = +modalId.split('-')[2];
    dataMethod.patchCardName(listId, cardId, cardName);
  },

  // 카드 드래그
  dragCard(e) {
    // console.log('카드 드래그스타트');
    cardBox = e.target.parentNode.parentNode;
    cardShadow = e.target.parentNode;
    cardContent = e.target;
    cardShadow.style.height = `${cardShadow.getBoundingClientRect().height}px`;
    dragTarget = 'card';

    const listId = cardShadow.parentNode.parentNode.parentNode.parentNode.id.split('-')[1];
    const cardId = cardShadow.parentNode.id.split('-')[1];
    cardShadow.removeChild(cardContent)
    dataMethod.removeDragCard(listId, cardId);
  },
  // 리스트 드래그
  dragList(e) {
    // console.log('리스트 드래그스타트', e.target);
    console.log('시작',e);
    
    listBox = e.target.parentNode.parentNode;
    listShadow = e.target.parentNode;
    listContent = e.target;
    listShadow.style.height = `${listShadow.getBoundingClientRect().height}px`;
    listShadow.removeChild(listContent);
    dragTarget = 'list';
    listContent.style.opacity = '1';
    listContent.style.transform = 'rotate(10deg)';
  },
  dragEnterCard(e) {
    if (dragTarget === 'card') {
      console.log('카드 드래그엔터', e.target);
      if (e.target.className === 'list-header') e.target.nextElementSibling.insertBefore(cardBox, e.target.nextElementSibling.firstElementChild);
      if (e.target.className === 'card-add-box') e.target.previousElementSibling.appendChild(cardBox);
      if (e.target.className === 'card-content') e.target.parentNode.parentNode.parentNode.insertBefore(cardBox, e.target.parentNode.parentNode);
      if (e.target.className === 'list-open-add-mod-btn') e.target.parentNode.previousElementSibling.appendChild(cardBox);
    }
    if (dragTarget === 'list') {
      if (e.target.className === 'list') e.target.parentNode.parentNode.insertBefore(listBox, e.target.parentNode)
      if (e.target.className === 'list-wrapper') e.target.parentNode.insertBefore(listBox, e.target);
      if (e.target.className === 'list-add-wrapper') e.target.previousElementSibling.appendChild(listBox);
      if (e.target.className === 'main') e.target.firstElementChild.appendChild(listBox);
      if (e.target.className === 'card-box') e.target.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(listBox, e.target.parentNode.parentNode.parentNode.parentNode);
      if (e.target.className === 'list-header') e.target.parentNode.parentNode.parentNode.parentNode.insertBefore(listBox, e.target.parentNode.parentNode.parentNode);
      if (e.target.className === 'card-add-box') e.target.parentNode.parentNode.parentNode.parentNode.insertBefore(listBox, e.target.parentNode.parentNode.parentNode);
      if (e.target.className === 'card-content') e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(listBox, e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
      if (e.target.className === 'card-shadow') e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.insertBefore(listBox, e.target.parentNode.parentNode.parentNode.parentNode.parentNode);
      if (e.target.className === 'list-add-box') e.target.parentNode.previousElementSibling.appendChild(listBox);
    }
  },
  dropCard(e) {
    if (dragTarget === 'card') {
      cardShadow.appendChild(cardContent);
      cardShadow.style.height = `100%`;

      const listId = +cardBox.parentNode.parentNode.parentNode.id.split('-')[1];

      dataMethod.addDragCard(listId, dragCard);
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
  },

  // 카드 모달 오픈
  cardModalOpen(cardId, listId) {
    
    const _listId = +listId.split('-')[1];
    const _cardId = +cardId.split('-')[1];
    document.querySelector('.modal-wrapper').style.display = 'block';
    dataMethod.getModalData(_listId, _cardId)
  },
  // 카드 모달 닫기
  cardModalClose(target) {
    $modalWrapper.style.display = 'none';
    document.querySelector('.modal-wrapper').style.display = 'none';
  
  },
  // 디스크립션 변경
  patchDescriptionContent(modalId, content) {
    const listId = +modalId.split('-')[1];
    const cardId = +modalId.split('-')[2];
    dataMethod.patchDescriptionContent(listId, cardId, content);
  }
};


// 이벤트 바인딩
const mainEventBindings = () => {
  document.querySelector('main').onclick = ({
    target
  }) => {
    // console.log(target);
    if (target.matches('.add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    else if (target.matches('.card-add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    else if (target.matches('.open-add-mod-btn')) mainEventHandlers.openAddMod(target);
    else if (target.matches('.list-open-add-mod-btn')) mainEventHandlers.openAddMod(target);

    else if (target.matches('.remove-list-btn')) mainEventHandlers.removeList(target.parentNode.parentNode.parentNode.id);
    else if (target.matches('.card-add-btn')) {
      if (!target.parentNode.previousElementSibling.value) return;
      mainEventHandlers.addCard(target.parentNode.previousElementSibling.value, target.parentNode.parentNode.parentNode.parentNode.parentNode.id);
      target.parentNode.previousElementSibling.value = '';
    }
    else if (target.matches('.card-remove-btn')) mainEventHandlers.removeCard(target.parentNode.parentNode.parentNode.id, target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
    else if (target.matches('.list-header-name')) mainEventHandlers.openListNameInput(target);
    else if (target.matches('.card')) mainEventHandlers.cardModalOpen(target.parentNode.parentNode.parentNode.id,target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
  };
  // 모달 클릭 이벤트
  $modalWrapper.onclick = ({target}) => {
    if (target.matches('.modal-close-btn')) mainEventHandlers.cardModalClose(target);
    if (target.matches('.modal-card-head')) mainEventHandlers.openListNameInput(target);
    if (target.matches('.modal-description-content')) mainEventHandlers.openAddMod(target);
    if (target.matches('.description-edit-close-btn')) mainEventHandlers.closeAddMod(target);
  
  }

  // 버튼 클릭시 리스트 생성
  document.querySelector('.list-add-btn').onclick = () => {
    console.log('리스트생성');
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
  $main.onkeyup = e => {
    console.log('카드추가');
    if (!e.target.matches('.card-name-box')) return;
    const cardName = e.target.value.trim();
    if (e.keyCode !== 13 || cardName === '') return;
    console.log('카드추가');
    mainEventHandlers.addCard(cardName, e.target.parentNode.parentNode.parentNode.parentNode.id);
    e.target.value = '';
  };

  // 인풋 입력시 리스트 이름 변경
  $mainWrapper.onkeyup = e => {
    if (!e.target.matches('.list-header-name-input')) return;
    const listName = e.target.value.trim();
    if (e.keyCode !== 13 || listName === '') return;
    mainEventHandlers.patchListName(listName, e.target.parentNode.parentNode.parentNode.id);
    e.target.value = '';
    mainEventHandlers.closeListNameInput(e.target);
  };
  // 인풋 입력시 카드 네임 변경
  $modalWrapper.onkeyup = e => {
    if (e.target.matches('.modal-card-name-input')) {
      const cardName = e.target.value.trim();
      if (e.keyCode !== 13 || cardName === '') return;
      mainEventHandlers.patchCardName(e.target.parentNode.parentNode.id, cardName);
      e.target.value = '';
      mainEventHandlers.closeListNameInput(e.target);
    }
    if (e.target.matches('.modal-description-input')) {
      const descriptionContent = e.target.value.trim();
      if (e.keyCode !== 13 || descriptionContent === '') return;
      mainEventHandlers.patchDescriptionContent(e.target.parentNode.parentNode.parentNode.id, descriptionContent);
      e.target.value = '';
      mainEventHandlers.closeDescriptionContentInput(e.target);
    }
  };

  // 드래그 이벤트
  $main.ondrag = e => {
    if (e.target.matches('.card-content')) mainEventHandlers.dragCard(e);
    if (e.target.matches('.list-content')) mainEventHandlers.dragList(e);
  };
  $main.ondragenter = e => {
    e.preventDefault();
    mainEventHandlers.dragEnterCard(e);
  };
  $main.ondragover = e => {
    e.preventDefault();
  };
  $main.ondrop = e => {
    // e.preventDefault();
    // console.log('드랍', e.target, e.currentTarget);
    mainEventHandlers.dropCard(e);
    isdrag = false;
  };


  // 드래그 스크린 이벤트
  $main.addEventListener('mousedown', function (e) {
    isdrag = true
    pos.x = e.clientX;
    document.getElementsByTagName("body")[0].style.cursor = 'grab'
  }, false)
  $main.addEventListener('mousemove', function move(e) {
    if (isdrag === true) {
      offset.x = pos.x - e.clientX;
      $main.scrollBy(offset.x/5, 0);
    }
  }, false)
  $main.addEventListener('mouseup', function (e) {
    document.querySelector('body').style.cursor = 'default'
    isdrag = false;
  });
};


// 메인엔트리
// eslint-disable-next-line import/prefer-default-export
export const initMain = async () => {
  await dataMethod.getMainData();
  renderList();
  mainEventBindings();
  // dragEvent();
};