const playArea = document.getElementById('play-area');
const factoryList = document.getElementById('factory-list');
const upgradePanel = document.getElementById('upgrade-panel');
const upgradeList = document.getElementById('upgrade-list');
const moneyDisplay = document.getElementById('money');
const closeUpgradeButton = document.getElementById('close-upgrade');
const resetGameButton = document.getElementById('reset-game');

let factoriesData = [];

async function loadFactories() {
  try {
    const response = await fetch('factories.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch factories.json: ${response.statusText}`);
    }
    factoriesData = await response.json();
    renderFactoryList();
  } catch (error) {
    console.error('Error loading factories:', error);
    factoriesData = [
      {
        name: 'run-down',
        price: 0,
        production: 1,
        productionTime: 1,
        icon: 'graphics/run-down-factory.png'
      }
    ];
    renderFactoryList();
  }
}

function renderFactoryList() {
  factoryList.innerHTML = '';
  factoriesData.forEach(factory => {
    const div = document.createElement('div');
    div.className = 'factory-item';
    div.innerHTML = `${factory.name} - ${factory.price} <img src="${factory.icon}">`;
    div.onclick = () => selectFactory(factory);
    factoryList.appendChild(div);
  });
}

function renderFactories() {
  playArea.innerHTML = '';
  gameState.factories.forEach(factory => {
    const factoryData = factoriesData.find(f => f.name === factory.type) || {
      icon: 'graphics/default-factory.png',
      production: 1,
      productionTime: 1
    };
    const div = document.createElement('div');
    div.className = 'factory';
    if (gameState.selectedForUpgrade && gameState.selectedForUpgrade.id === factory.id) {
      div.classList.add('highlighted');
    }
    div.style.left = `${factory.x}%`;
    div.style.top = `${factory.y}%`;
    div.style.width = `${factory.iconSize}vmin`;
    div.style.height = `${factory.iconSize}vmin`;
    div.innerHTML = `<img src="${factoryData.icon}" style="width: ${factory.iconSize}vmin;">`;
    div.onclick = () => showUpgrades(factory);
    playArea.appendChild(div);
  });
  moneyDisplay.textContent = Math.floor(gameState.money);
}

function gameTick() {
  gameState.factories.forEach(factory => {
    const factoryData = factoriesData.find(f => f.name === factory.type) || {
      production: 1,
      productionTime: 1
    };
    factory.timer += 0.5;
    if (factory.timer >= factoryData.productionTime) {
      gameState.money += factoryData.production;
      factory.timer = 0;
    }
  });
  renderFactories();
}

playArea.onclick = placeFactory;
closeUpgradeButton.onclick = closeUpgradePanel;
resetGameButton.onclick = resetGame;

window.onload = async () => {
  await loadFactories();
  loadGame();
  setInterval(gameTick, 500);
  setInterval(saveGame, 60000);
};