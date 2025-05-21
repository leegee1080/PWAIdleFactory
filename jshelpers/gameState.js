let gameState = {
  money: 0,
  factories: [{ id: 0, type: 'run-down', x: 10, y: 10, timer: 0, iconSize: 5 }],
  selectedFactory: null,
  selectedForUpgrade: null
};

function saveGame() {
  localStorage.setItem('idleFactoryGame', JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem('idleFactoryGame');
  if (saved) {
    gameState = JSON.parse(saved);
  }
  renderFactories();
}

function resetGame() {
  localStorage.removeItem('idleFactoryGame');
  gameState = {
    money: 0,
    factories: [{ id: 0, type: 'run-down', x: 10, y: 10, timer: 0, iconSize: 5 }],
    selectedFactory: null,
    selectedForUpgrade: null
  };
  renderFactories();
  saveGame();
}