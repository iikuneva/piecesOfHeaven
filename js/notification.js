const elements = {
    info: document.querySelector('#success'),
    error: document.querySelector('#error'), 
};

elements.info.addEventListener('click', hideInfo);
elements.error.addEventListener('click', hideError);

export function showInfo(message) {
    elements.info.children[0].textContent = message;
    elements.info.style.display = 'block';

    setTimeout(hideInfo, 1000);
}

export function showError(message) {
    elements.error.children[0].textContent = message;
    elements.error.style.display = 'block';

    setTimeout(hideError, 1000);
}


function hideInfo() {
    elements.info.style.display = 'none';
}

function hideError() {
    elements.error.style.display = 'none';
}

