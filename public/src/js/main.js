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
  eventBindings
} from "./eventBindings.js"

const ajax = {
  get(url) {
    return fetch(url);
  },
  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  },
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  },
  delete(url) {
    return fetch(url, {
      method: 'DELETE'
    });
  }
};
const $main = document.querySelector('main');
const $listNameBox = document.querySelector('.list-name-box');
const $mainWrapper = document.querySelector('.main-wrapper');
let lists = [];

const renderList = () => {

  let html = '';
  lists.forEach(list => {
    html +=
      `<div id = "${list.id}" class="list-wrapper">
      <div class="list">
        <div class="list-header">
          <textarea class="list-header-name">${list.name}</textarea>
          <button class="close-list-btn">x</button>
        </div>
        <ul class="list-container">
        </ul>
        <div class="list-name-input">
          <input type="text" placeholder="insert todos">
        </div>
      </div>
    </div>`;
  });
  $mainWrapper.innerHTML = html;
  html = '';

  // cards.forEach(card => {
  //   const targetList = document.querySelector(`#${card.list_id}`)
  //   targetList.firstElementChild.innerHTML += `
  //   <li id = "${card.id}" class="card-box">
  //     <a class="card" href="/c/jUKFKu6Q/5-df">카드</a>
  //     <button class="card-close-btn">x</button>
  //   </li>`;
  // });
  // $mainWrapper.innerHTML +=
  //   `   <div class="list-wrapper">
  //       <div class="list-add-box">
  //         <a class="open-add-mod-btn"><span>+</span>Add another list</a>
  //           <div class="add-mod" style="display: none;">  
  //             <input class="list-name-box" type=" text" placeholder="enter list title...">
  //             <div class="add-mod-btn">
  //               <button class="list-add-btn">Add List</button>
  //               <a class="add-mod-close-btn">x</a>
  //             </div>
  //           </div>
  //       </div>
  //     </div>`
};

const getMainData = async () => {
  const responseLists = await ajax.get('/lists');
  const listData = await responseLists.json();
  // const responseCards = await ajax.get('/cards');
  // const cardData = await responseCards.json();
  lists = listData;
  // cards = cardData;
};

// 이벤트 핸들러
const mainEventHandlers = {
  // 메인 이벤트 핸들러
  closeAddMod(target) {
    target.parentNode.parentNode.style.display = 'none';
  },
  openAddMod(target) {
    console.log(target.nextElementSibling);
    target.nextElementSibling.style.display = 'block';
  },
  addList(Name) {
    const generatedListId = () => (lists.length ? Math.max(...lists.map(list => list.id.replace(/[^0-9]/g, ''))) + 1 : 1);
    const list = new List(generatedListId(), Name);
    console.log(list);

    ajax.post('/lists', list)
      .then(response => response.json())
      .then(_list => {
        lists = [...lists, _list]
      })
      .then(renderList)
      .catch(err => console.error(err));
  },

  closeList(id) {
    console.log(id);
    
    ajax.delete(`/lists/${id}`)
      .then(lists = lists.filter(list => list.id !== id))
      .then(renderList)
      .catch(err => console.error(err));
    // if (cards.length) {
    //   cards.filter(card => card.list_id === id).forEach(card => {
    //     ajax.delete(`/cards/${card.id}`);
    //   });
    //   cards = cards.filter(card => card.list_id !== id);
    // };
  }
};

// 이벤트 바인딩
const mainEventBindings = () => {
  document.querySelector('main').onclick = ({target}) => {
    console.log(target);
    if (target.matches('.close-list-btn')) mainEventHandlers.closeList(target.parentNode.parentNode.parentNode.id);
    if (target.matches('.add-mod-close-btn')) mainEventHandlers.closeAddMod(target);
    if (target.matches('.open-add-mod-btn')) mainEventHandlers.openAddMod(target);
    if (target.matches('.list-add-btn')) {
      if (!$listNameBox) return;
      mainEventHandlers.addList($listNameBox.value.trim());
      $listNameBox.value = '';
    }
  }

  document.querySelector('.list-name-box').onkeyup = e => {
    console.log(e.target);
    if (!e.target === $listNameBox) return;
    const listName = e.target.value.trim();
    if (e.keyCode !== 13 || listName === '') return;
    mainEventHandlers.addList(listName);
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