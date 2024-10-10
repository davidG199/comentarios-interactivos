document.addEventListener("DOMContentLoaded", function () {
  fetchComments();
});

// Función para obtener los datos del archivo JSON
function fetchComments() {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      initializeCommentsSection(data);
    })
    .catch((error) => console.error("Error al obtener los datos ", error));
}

let container = document.querySelector("#contenedor");
let containerReply = document.querySelector("#replyContainer");

// Función para inicializar la sección de comentarios
function initializeCommentsSection(data) {
  createCards(data.comments, data.currentUser);
  displayCurrentUser(data.currentUser);
}

// Función para crear las cards de comentarios
function createCards(comments, currentUser) {
  comments.forEach((comment, index) => {
    createCard(comment, currentUser, index);
    if (comment.replies.length > 0) {
      createReplies(comment.replies, currentUser, index);
    }
  });
  addReplyEventListeners(currentUser);
}

// Función para crear una card de comentario
function createCard(comment, currentUser, commentIndex) {
  const card = document.createElement("div");
  card.className = " card";
  // Ahora pasamos `commentIndex` como argumento a `generateCardHTML`
  card.innerHTML = `
    ${generateCardHTML(comment, commentIndex)}
    <div class="pl-5 md:ml-12 md:pl-8   mt-4 gap-5 flex flex-col border-l-2 border-[var(--Light-grayish-blue)]" id="replyContainer-${commentIndex}">
    </div>
  `;
  container.appendChild(card);
}

// Función para crear las respuestas de un comentario
function createReplies(replies, currentUser, commentIndex) {
  replies.forEach((reply, replyIndex) => {
    createReplyCard(reply, currentUser, commentIndex, replyIndex);
  });
}

// Generar HTML dinámico para una card
// Aceptamos `commentIndex` como parámetro
function generateCardHTML(comment, commentIndex) {
  return `
  <div class="bg-[var(--White)] p-5 md:p-6 py-4 rounded-md md:flex gap-5">
    <div class="hidden md:block mt-1">
      <span class="flex md:flex-col px-3 py-1 gap-3 bg-[var(--Light-gray)] rounded-xl">
        <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">+</button>
        <p class="text-[var(--Moderate-blue)] font-medium">${comment.score}</p>
        <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">-</button>
      </span>
    </div>
    <div>
      <div class="flex justify-between gap-4 items-center ">
        <div class="flex gap-4 items-center ">
          <img src="${comment.user.image.webp}" alt="${comment.user.username}" class="w-8 h-8" />
          <p class="font-medium">${comment.user.username}</p>
          <p class="text-[var(--Grayish-Blue)]">${comment.createdAt}</p>
        </div>
        <span class="hidden md:flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)] reply-button" data-comment-index="${commentIndex}">
          <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
          <p class="font-semibold">Reply</p>
        </span>
      </div>
      <div class="text-[var(--Grayish-Blue)] mt-3 md:mr-8">
        <p>${comment.content}</p>
      </div>
    </div>

    <div class="flex justify-between mt-5 md:hidden">
      <span class="flex px-5 py-2 gap-3 bg-[var(--Light-gray)] rounded-xl">
        <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">+</button>
        <p class="text-[var(--Moderate-blue)] font-medium">${comment.score}</p>
        <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">-</button>
      </span>
      <span class="flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)] reply-button" data-comment-index="${commentIndex}">
        <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
        <p class="font-semibold">Reply</p>
      </span>
    </div>
  </div>
  `;
}

// Función para crear una card de respuesta
function createReplyCard(reply, currentUser, commentIndex, replyIndex) {
  const replyCard = document.createElement("div");
  replyCard.className = "card-body";

  let isReplyCurrentUser = reply.user.username === currentUser.username;

  replyCard.innerHTML = `
    <div class="bg-[var(--White)] p-5 md:p-6 py-4 rounded-md md:flex gap-5">
      <div>
        <span class="hidden md:flex md:flex-col px-3 py-1 gap-3 bg-[var(--Light-gray)] rounded-xl">
          <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">+</button>
          <p class="text-[var(--Moderate-blue)] font-medium">${reply.score}</p>
          <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">-</button>
        </span>
      </div>
      <div>
        <div class="flex gap-4 items-center justify-between">
          <div class="flex gap-4 items-center">
            <img src="${reply.user.image.webp}" alt="${reply.user.username}" class="w-8 h-8" />
            <p class="font-medium">${reply.user.username}</p>
            ${
              isReplyCurrentUser
                ? '<p class="bg-[var(--Moderate-blue)] text-xs text-white px-2 py-[2px] rounded-sm">you</p>'
                : ""
            }
            <p class="text-[var(--Grayish-Blue)]">${reply.createdAt}</p>
          </div>
            ${
              isReplyCurrentUser
                ? `
                <span class="hidden md:flex gap-4 items-center cursor-pointer">
                  <p class="flex items-center font-semibold cursor-pointer text-[var(--Soft-Red)] delete-button" onclick="showModalDelete()">
                  <img src="../images/icon-delete.svg" alt="Delete" class="w-4 h-4 mr-2"/>
                    Delete
                  </p>
                  <p class="flex items-center font-semibold cursor-pointer text-[var(--Moderate-blue)]">
                  <img src="../images/icon-edit.svg" alt="Edit" class="w-4 h-4 mr-2"/>
                    Edit
                  </p>
                </span>`
                : `
                <span class="hidden md:flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)] reply-button" data-comment-index="${commentIndex}" data-reply-index="${replyIndex}">
                  <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
                  <p class="font-semibold">Reply</p>
                </span>`
            }
        </div>
        <div class="text-[var(--Grayish-Blue)] mt-3">
          <p>
            <span class="text-[var(--Moderate-blue)] font-bold">
            @${reply.replyingTo}
            </span> 
            ${reply.content}
          </p>
        </div>
      </div>
      <div class="flex justify-between mt-5 md:hidden">
        <span class="flex px-4 py-2 gap-3 bg-[var(--Light-gray)] rounded-xl">
          <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">+</button>
          <p class="text-[var(--Moderate-blue)] font-medium">${reply.score}</p>
          <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">-</button>
        </span>
        ${
          isReplyCurrentUser
            ? `
            <span class="flex gap-4 items-center cursor-pointer">
              <p class="flex items-center font-semibold cursor-pointer text-[var(--Soft-Red)] delete-button" onclick="showModalDelete()">
                <img src="../images/icon-delete.svg" alt="Delete" class="w-4 h-4 mr-2"/>
                Delete
              </p>
              <p class="flex items-center font-semibold cursor-pointer text-[var(--Moderate-blue)]">
                <img src="../images/icon-edit.svg" alt="Edit" class="w-4 h-4 mr-2"/>
                Edit
              </p>
            </span>`
            : `
            <span class="flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)] reply-button" data-comment-index="${commentIndex}" data-reply-index="${replyIndex}">
              <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
              <p class="font-semibold">Reply</p>
            </span>`
        }
      </div>
    </div>
  `;

  // Buscar el contenedor de respuestas específico del comentario y añadir ahí la respuesta
  const replyContainer = document.getElementById(
    `replyContainer-${commentIndex}`
  );
  replyContainer.appendChild(replyCard);
}

// Manejador de eventos para las respuestas
function addReplyEventListeners(currentUser) {
  document.querySelectorAll(".reply-button").forEach((button) => {
    button.addEventListener("click", function () {
      const commentIndex = this.getAttribute("data-comment-index");
      showReplyCard(commentIndex, currentUser);
    });
  });
}

// Mostrar el usuario logueado en la sección de comentarios
function displayCurrentUser(user) {
  const userCard = document.createElement("div");
  userCard.className = "p-5 py-4 mt-4 md:p-6 bg-[var(--White)] rounded-md";
  userCard.innerHTML = `
    <div class="flex flex-col md:flex-row md:gap-5">
      <div class="hidden md:block">
        <img src="${user.image.webp}" alt="${user.username}" class="w-8 h-8" />
      </div>
      <textarea class="
                    flex-1 py-2 px-5 min-h-24 rounded-md border border-[var(--Light-gray)] 
                    focus:border-[var(--Moderate-blue)] focus:outline-none" 
                    placeholder="Add a comment...">
      </textarea>
      <div class="hidden md:block">
        <button class="bg-[var(--Moderate-blue)] hover:bg-[var(--Light-grayish-blue)] text-white px-3 py-2 rounded-md h-12 w-24">
          SEND
        </button>
      </div>
      <div class="flex justify-between mt-5 items-center md:hidden">
        <img src="${user.image.webp}" alt="${user.username}" class="w-8 h-8" />
        <button class="bg-[var(--Moderate-blue)] hover:bg-[var(--Light-grayish-blue)] text-white px-3 py-2 rounded-md h-12 w-24">
          SEND
        </button>
      </div>
    </div>
  `;
  container.appendChild(userCard);
}

function showReplyCard(commentIndex, currentUser) {
  const replyContainer = document.getElementById(
    `replyContainer-${commentIndex}`
  );

  // Eliminar cualquier cuadro de respuesta previo
  const existingReplyCard = document.querySelector(".reply-active");
  if (existingReplyCard) {
    existingReplyCard.remove();
  }

  // Crear la nueva tarjeta de respuesta
  const replyCard = document.createElement("div");
  replyCard.className =
    "p-5 py-4 md:p-6 bg-[var(--White)] rounded-md mt-4 reply-active";

  replyCard.innerHTML = `
    <div class="flex flex-col md:flex-row md:gap-5">
      <div class="hidden md:block">
        <img src="${currentUser.image.webp}" alt="${currentUser.username}" class="w-8 h-8" />
      </div>
      <textarea class="
                    flex-1 py-2 px-5 min-h-24 rounded-md border border-[var(--Light-gray)] 
                    focus:border-[var(--Moderate-blue)] focus:outline-none" 
                    placeholder="Add a reply..."></textarea>
                    <div class="hidden md:block">
      <div class="hidden md:block">
        <button class="bg-[var(--Moderate-blue)] hover:bg-[var(--Light-grayish-blue)] text-white px-3 py-2 rounded-md h-12 w-24">
          REPLY
        </button>
      </div>
    </div>
    <div class="flex justify-between mt-5 items-center md:hidden">
      <img src="${currentUser.image.webp}" alt="${currentUser.username}" class="w-8 h-8" />
      <button class="bg-[var(--Moderate-blue)] hover:bg-[var(--Light-grayish-blue)] text-white px-3 py-2 rounded-md h-12 w-24">Reply</button>
    </div>
  `;

  // Insertar el cuadro de respuesta dentro del contenedor de réplicas correcto
  replyContainer.appendChild(replyCard);
}

// Mostrar el modal para eliminar comentarios
function showModalDelete() {
  const modalContainer = document.getElementById("modalDelete");
  modalContainer.classList.remove("hidden");
}

// Ocultar el modal para eliminar comentarios
function hiddenModalDelete() {
  const modalContainer = document.getElementById("modalDelete");
  modalContainer.classList.add("hidden");
}

document
  .getElementById("cancelDelete")
  .addEventListener("click", hiddenModalDelete);
