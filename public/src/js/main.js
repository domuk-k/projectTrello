// import { header } from "./header.js"
import { Board } from "./board.js"
import { Card } from "./card.js"
import { List } from "./list.js"
import { User } from "./user.js"
import { fetchRequest } from "./fetchRequest.js"

const $listNameBox = document.querySelector('.list-name-box');
const $mainWrapper = document.querySelector('.main-wrapper');

let lists = [];
let cards = [];

// 랜더 
const renderList = () => {

  let html = '';
  lists.forEach(list => {
    html +=
      `<div  class="list-wrapper">
      <div id = "${list.id}" class="list">
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
    </div>`;
  });
  $mainWrapper.innerHTML = html;
  html = '';

  cards.forEach(card => {
    const targetList = document.querySelector(`#${card.list_id}`)
    targetList.firstElementChild.nextElementSibling.innerHTML += `
    <li id = "${card.id}" class="card-box">
      <a class="card" href="/c/jUKFKu6Q/5-df">카드</a>
      <button class="card-remove-btn">x</button>
    </li>`;
  });
};
const renderCard = target => {
  let html = '';
  let _cards = [];
  _cards = cards.filter(card => card.list_id === target.id);
  const targetList = document.querySelector(`#${target.id}`);
  _cards.forEach(card => {
    html += `
    <li id = "${card.id}" class="card-box">
      <a class="card" href="/c/jUKFKu6Q/5-df">${card.content}</a>
      <button class="card-remove-btn">x</button>
    </li>`;
  });
  targetList.firstElementChild.nextElementSibling.innerHTML = html;
  html = '';
};

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
  // 메인 이벤트 핸들러
  closeAddMod(target) {
    target.parentNode.parentNode.style.display = 'none';
  },
  openAddMod(target) {
    console.log('123');

    target.nextElementSibling.style.display = 'block';
  },

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
    console.log(id);

    fetchRequest.delete(`/lists/${id}`)
      .then(lists = lists.filter(list => list.id !== id))
      .then(renderList)
      .catch(err => console.error(err));
    if (cards.length) {
      cards.filter(card => card.list_id === id).forEach(card => {
        fetchRequest.delete(`/cards/${card.id}`);
      });
      cards = cards.filter(card => card.list_id !== id);
    };
  },

  addCard(content, target) {
    const generatedCardId = () => (cards.length ? Math.max(...cards.map(card => card.id.replace(/[^0-9]/g, ''))) + 1 : 1);
    const card = new Card(generatedCardId(), content, target.id);
    fetchRequest.post('/cards', card)
      .then(response => response.json())
      .then(_card => { cards = [...cards, _card] })
      .then(() => renderCard(target))
      .catch(err => console.error(err));
  },
  removeCard(id, target) {
    fetchRequest.delete(`/cards/${id}`)
      .then(cards = cards.filter(card => card.id !== id))
      .then(() => renderCard(target))
      // .then(renderOnload)
      .catch(err => console.error(err));
  }
};

// 이벤트 바인딩
const mainEventBindings = () => {
  document.querySelector('main').onclick = ({ target }) => {
    // console.log(target);

    if (target.matches('.add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    if (target.matches('.card-add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    if (target.matches('.open-add-mod-btn')) mainEventHandlers.openAddMod(target);
    if (target.matches('.remove-list-btn')) mainEventHandlers.removeList(target.parentNode.parentNode.id);
    if (target.matches('.card-add-btn')) {
      if (!target.parentNode.previousElementSibling.value) return;
      mainEventHandlers.addCard(target.parentNode.previousElementSibling.value, target.parentNode.parentNode.parentNode.parentNode);
      target.parentNode.previousElementSibling.value = '';
    }
    if (target.matches('.card-remove-btn')) mainEventHandlers.removeCard(target.parentNode.id, target.parentNode.parentNode.parentNode);
  };

  document.querySelector('.list-add-btn').onclick = () => {
    if (!$listNameBox.value) return;
    mainEventHandlers.addList($listNameBox.value.trim());
    $listNameBox.value = '';
  };

  $listNameBox.onkeyup = e => {
    if (!e.target === $listNameBox) return;
    console.log(e.target);
    const content = e.target.value.trim();
    if (e.keyCode !== 13 || content === '') return;
    mainEventHandlers.addList(content);
    e.target.value = '';
  };

  $mainWrapper.onkeyup = e => {
    if (!e.target.matches('.card-name-box')) return;
    console.log(e.target.parentNode.parentNode.parentNode.parentNode);
    const content = e.target.value.trim();
    if (e.keyCode !== 13 || content === '') return;
    mainEventHandlers.addCard(content, e.target.parentNode.parentNode.parentNode);
    e.target.value = '';
  };
};

// 메인엔트리
// eslint-disable-next-line import/prefer-default-export
export const initMain = async () => {
  await getMainData();
  renderList();
  mainEventBindings();
};