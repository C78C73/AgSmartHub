let livestock = [];

export function addLivestock(animal) {
    livestock.push(animal);
    updateLivestockDisplay();
}

function updateLivestockDisplay() {
    const livestockList = document.getElementById('livestock-list');
    livestockList.innerHTML = '';

    livestock.forEach((animal, index) => {
        const animalElement = document.createElement('div');
        animalElement.className = 'livestock-item';
        animalElement.innerHTML = `
            <h3>${animal.name}</h3>
            <p>Type: ${animal.type}</p>
            <p>Age: ${animal.age}</p>
            <button onclick="window.removeLivestock(${index})">Remove</button>
        `;
        livestockList.appendChild(animalElement);
    });
}

// Make removeLivestock function available globally
window.removeLivestock = function(index) {
    livestock.splice(index, 1);
    updateLivestockDisplay();
};

// Initial display update
document.addEventListener('DOMContentLoaded', updateLivestockDisplay);