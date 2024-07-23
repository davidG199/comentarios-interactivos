document.addEventListener("DOMContentLoaded", function () {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createCard(data.comments, data.currentUser);
      currentUser(data.currentUser);
    })
    .catch((error) => console.error("Error al obtener los datos ", error));
});

let container = document.querySelector("#contenedor");

function createCard(comments, currentUser) {
  comments.forEach((comment, commentIndex) => {
    let card = document.createElement("div");
    card.className = "p-5 py-4 bg-[var(--White)] rounded-md";

    card.innerHTML = `
      <div class="flex gap-4 items-center">
        <img src="${comment.user.image.webp}" 
        alt="${comment.user.username}"
        class="w-8 h-8" 
        />
        <p class="font-bold">${comment.user.username}</p>
        <p class="text-[var(--Grayish-Blue)]">${comment.createdAt}</p>
      </div>
      <div>
        <p class="text-[var(--Grayish-Blue)] mt-3">
          ${comment.content}
        </p>
      </div>
      <div class="flex justify-between mt-5">
        <span class="flex px-4 py-2 gap-3 bg-[var(--Light-gray)] rounded-xl">
          <button 
            class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold ">
            +
          </button>
          <p class="text-[var(--Moderate-blue)] font-medium">
          ${comment.score}
          </p>
          <button 
            class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">
              -
            </button>
        </span>
        <span 
        class="flex gap-2 items-center cursor-pointer 
        hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)]">
                <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
                <p class="font-semibold">Reply</p>
              </span>
      </div>  
    `;
    container.appendChild(card);

    if (comment.replies.length > 0) {
      let containerReply = document.querySelector("#replyContainer");
      comment.replies.forEach((reply, replyIndex) => {
        let replyCard = document.createElement("div");
        replyCard.className = "p-5 py-4 bg-[var(--White)] rounded-md";
        let isReplyCurrentUser = reply.user.username === currentUser.username;
        replyCard.innerHTML = `
          <div class="flex gap-4 items-center">
            <img 
            src="${reply.user.image.webp}" 
            alt="${reply.user.username}" 
            class="w-8 h-8" />
            <p class="font-bold">${reply.user.username}</p>
            ${
              isReplyCurrentUser
                ? '<p class="bg-[var(--Moderate-blue)] text-xs text-white px-2 py-[2px] rounded-sm">you</p>'
                : ""
            }
            <p class="text-[var(--Grayish-Blue)]">${reply.createdAt}</p>
          </div>
          <div class="text-[var(--Grayish-Blue)] mt-3">
            <p>
              <span class="text-[var(--Moderate-blue)] font-bold">
                @${reply.replyingTo}
              </span> 
              ${reply.content}
            </p>
          </div>
          <div class="flex justify-between mt-5">
            <span class="flex px-4 py-2 gap-3 bg-[var(--Light-gray)] rounded-xl">
              <button 
              class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">
                +
              </button>
              <p class="text-[var(--Moderate-blue)] font-medium">
                ${reply.score}
              </p>
              <button 
              class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] hover:font-bold">
                -
              </button>
            </span>
            ${
              isReplyCurrentUser
                ? `
              <span class="flex gap-4 items-center cursor-pointer">

                <p class="flex items-center font-semibold cursor-pointer text-[var(--Soft-Red)]" id="delete-${commentIndex}-${replyIndex}">
                  <img 
                  src="../images/icon-delete.svg" 
                  alt="Delete" 
                  class="w-4 h-4 mr-2"
                  />
                  Delete
                </p>

                <p class="flex items-center font-semibold cursor-pointer text-[var(--Moderate-blue)]">
                  <img 
                  src="../images/icon-edit.svg" 
                  alt="Edit" 
                  class="w-4 h-4 mr-2"
                  />
                  Edit
                </p>
              </span>
            `
                : `
              <span class="flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)]">
                <img 
                src="../images/icon-reply.svg" 
                alt="Reply" 
                class="w-4 h-4" 
                />
                <p class="font-semibold">Reply</p>
              </span>
            `
            }
          </div>
        `;
        containerReply.appendChild(replyCard);
        container.appendChild(containerReply);
        if (isReplyCurrentUser) {
          document.getElementById(`delete-${commentIndex}-${replyIndex}`).addEventListener("click", showModalDelete);
        }
      });
    }
  });
}

function currentUser(user) {
  let userCard = document.createElement("div");
  userCard.className = "p-5 py-4 bg-[var(--White)] rounded-md";
  userCard.innerHTML = `
    <div class="flex flex-col ">
      <textarea 
        class="flex-1 py-2 px-5 min-h-24 rounded-md
        border border-[var(--Light-gray)] 
        focus:border-[var(--Moderate-blue)] focus:outline-none" 
        placeholder="Add a comment...">

      </textarea>
      <div class="flex justify-between mt-5 items-center" >
        <img 
        src="${user.image.webp}" 
        alt="${user.username}" 
        class="w-8 h-8" 
        />
        <button 
        class="bg-[var(--Moderate-blue)] hover:bg-[var(--Light-grayish-blue)]
        text-white 
        px-4 py-2 
        rounded-md 
        h-12 w-28 
        ">
          Send
        </button>
      </div>
    </div>
  `;
  container.appendChild(userCard);
}

// modal delete

function showModalDelete() {
  const modalContainer = document.getElementById("modalDelete");
  modalContainer.classList.remove("hidden");
}

function hiddenModalDelete() {
  const modalContainer = document.getElementById("modalDelete");
  modalContainer.classList.add("hidden");
}

document.getElementById("cancelDelete").addEventListener("click", hiddenModalDelete);