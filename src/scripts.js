document.addEventListener("DOMContentLoaded", function () {
  fetch("../data.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createCard(data.comments);
      currentUser(data.currentUser);
    })
    .catch((error) => console.error("Error al obtener los datos ", error));
});

let container = document.querySelector("#contenedor");

function createCard(comments) {
  comments.forEach((comment) => {
    let card = document.createElement("div");
    card.className = "p-5 py-4 bg-[var(--White)] rounded-md";
    card.innerHTML = `
    <div class="flex gap-4 items-center">
        <img src="${comment.user.image.webp}" alt="${comment.user.username}" class="w-8 h-8" />
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
            <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] font-medium">+</button>
            <p class="text-[var(--Moderate-blue)] font-medium">${comment.score}</p>
            <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)]">-</button>
        </span>
        <span class="flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)]">
            <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
            <p class="font-semibold">Reply</p>
        </span>
    </div>
`;
    container.appendChild(card);

    if (comment.replies.length > 0) {
      let containerReply = document.querySelector("#replyContainer");
      comment.replies.forEach((reply) => {
        let replyCard = document.createElement("div");
        replyCard.className = "p-5 py-4 bg-[var(--White)] rounded-md";
        replyCard.innerHTML = `
         <div class="flex gap-4 items-center">
            <img src="${reply.user.image.webp}" alt="${reply.user.username}" class="w-8 h-8" />
            <p class="font-bold">${reply.user.username}</p>
            <p class="text-[var(--Grayish-Blue)]">${reply.createdAt}</p>
          </div>
          <div class="text-[var(--Grayish-Blue)] mt-3">
            <p><span class="text-[var(--Moderate-blue)] font-bold">@${reply.replyingTo}</span> ${reply.content}</p>
         </div>
          <div class="flex justify-between mt-5">
            <span class="flex px-4 py-2 gap-3 bg-[var(--Light-gray)] rounded-xl">
              <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)] font-medium">+</button>
                <p class="text-[var(--Moderate-blue)] font-medium">${reply.score}</p>
              <button class="text-[var(--Light-grayish-blue)] hover:text-[var(--Moderate-blue)]">-</button>
            </span>
            <span class="flex gap-2 items-center cursor-pointer hover:text-[var(--Grayish-Blue)] text-[var(--Moderate-blue)]">
              <img src="../images/icon-reply.svg" alt="Reply" class="w-4 h-4" />
              <p class="font-semibold">Reply</p>
              </span>
          </div>
        `;
        containerReply.appendChild(replyCard);
        container.appendChild(containerReply);
      });
    }
  });
}

function currentUser(user) {
  let userCard = document.createElement("div");
  userCard.className = "p-5 py-4 bg-[var(--White)] rounded-md";
  userCard.innerHTML = `
    <div class="flex flex-col ">
      <textarea class="flex-1 border-2 rounded-md py-2 px-5 min-h-24 " placeholder="Add a comment..."></textarea>
      <div class="flex justify-between mt-5 items-center" >
        <img src="${user.image.webp}" alt="${user.username}" class="w-8 h-8" />
        <button class="bg-[var(--Moderate-blue)] text-white px-4 py-2 rounded-md h-12 w-28">Send</button>
      </div>
    </div>
  `;
  container.appendChild(userCard);
}
