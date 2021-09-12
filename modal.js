const overlap = document.querySelector(".overlap");
const modalTitle = document.querySelector("#modal h2");
const modalContent = document.querySelector("#modal .modal-content");
const modalOkButton = document.querySelector("#modal button");

function showModal() {
    overlap.hidden = false;
}

function hideModal() {
    overlap.hidden = true;

}
function setModalContent(title, callback) {
    modalTitle.textContent = title;
    modalContent.innerHTML = ""
    callback(modalContent);
}

modalOkButton.addEventListener("click", hideModal);