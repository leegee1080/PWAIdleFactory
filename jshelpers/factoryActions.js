function selectFactory(factory) {
  gameState.selectedFactory = factory;
}

function placeFactory(event) {
  if (!gameState.selectedFactory || gameState.money < gameState.selectedFactory.price) return;
  const rect = playArea.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  gameState.factories.push({
    id: Date.now(),
    type: gameState.selectedFactory.name,
    x,
    y,
    timer: 0,
    iconSize: 5
  });
  gameState.money -= gameState.selectedFactory.price;
  gameState.selectedFactory = null;
  renderFactories();
  saveGame();
}

function showUpgrades(factory) {
  gameState.selectedForUpgrade = factory;
  upgradePanel.style.display = 'block';
  upgradeList.innerHTML = '';
  const upgrades = [
    {
      name: 'Double Production',
      price: 100,
      effect: (factory) => {
        const oldSize = factory.iconSize;
        factory.timer /= 2;
        factory.iconSize *= 2;
        const playAreaRect = playArea.getBoundingClientRect();
        const pxPerPercentX = playAreaRect.width / 100;
        const pxPerPercentY = playAreaRect.height / 100;
        factory.x += (oldSize - factory.iconSize) / 2 / pxPerPercentX;
        factory.y += (oldSize - factory.iconSize) / 2 / pxPerPercentY;
      }
    }
  ];
  upgrades.forEach(upgrade => {
    const div = document.createElement('div');
    div.className = 'factory-item';
    div.innerHTML = `${upgrade.name} - ${upgrade.price}`;
    div.onclick = () => buyUpgrade(upgrade);
    upgradeList.appendChild(div);
  });
  renderFactories();
}

function buyUpgrade(upgrade) {
  if (gameState.money < upgrade.price || !gameState.selectedForUpgrade) return;
  gameState.money -= upgrade.price;
  upgrade.effect(gameState.selectedForUpgrade);
  upgradePanel.style.display = 'none';
  gameState.selectedForUpgrade = null;
  renderFactories();
  saveGame();
}

function closeUpgradePanel() {
  upgradePanel.style.display = 'none';
  gameState.selectedForUpgrade = null;
  renderFactories();
}