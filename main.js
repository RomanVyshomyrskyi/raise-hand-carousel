/**
 * Raise Hand Carousel | v1.0.0
 * Core module script
 */

// Keep an ordered array of user IDs who have raised their hands
let raiseOrder = [];

// 1. Initialize on Foundry boot
Hooks.once('init', () => {
  console.log('Raise Hand Carousel | Initializing');
  // Register a game setting to persist the order (optional)
  game.settings.register('raise-hand-carousel', 'order', {
    scope: 'world',
    config: false,
    type: Array,
    default: []
  });
});

// 2. When Foundry is ready, restore saved order and render UI (GM only)
Hooks.once('ready', () => {
  // Load order from settings
  raiseOrder = game.settings.get('raise-hand-carousel', 'order');
  if (game.user.isGM) renderCarousel();
});

// 3. Listen for the player macro call to raise hand
Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
  if (messageText.trim() === '/raise-hand') {
    const uid = game.user.id;
    if (!raiseOrder.includes(uid)) {
      raiseOrder.push(uid);
      game.settings.set('raise-hand-carousel', 'order', raiseOrder);
      if (game.user.isGM) renderCarousel();
    }
    return false; // prevent default chat message
  }
  return true;
});

// 4. Render or update the carousel application
function renderCarousel() {
  const users = raiseOrder.map(uid => {
    const u = game.users.get(uid);
    return {
      id: uid,
      name: u.name,
      avatar: u.character?.img || u.avatar || "icons/svg/mystery-man.svg"
    };
  });
  // Render Handlebars template into a DOM container
  const html = Handlebars.compile(
    game.modules.get('raise-hand-carousel').templates['templates/carousel.hbs']
  )({ users });
  let existing = document.getElementById('hand-carousel');
  if (existing) existing.replaceWith(html);
  else document.body.insertAdjacentHTML('afterbegin', html.outerHTML || html);
  activateControls();
}

// 5. Add click and drag handlers once rendered
function activateControls() {
  const container = document.getElementById('hand-carousel');
  if (!container) return;

  // Button handlers
  container.querySelectorAll('.controls button').forEach(btn => {
    btn.onclick = () => {
      const entry = btn.closest('.entry');
      const uid = entry.dataset.userId;
      if (btn.classList.contains('remove')) {
        raiseOrder = raiseOrder.filter(id => id !== uid);
      } else if (btn.classList.contains('move-up')) {
        const i = raiseOrder.indexOf(uid);
        if (i > 0) [raiseOrder[i-1], raiseOrder[i]] = [raiseOrder[i], raiseOrder[i-1]];
      } else if (btn.classList.contains('move-down')) {
        const i = raiseOrder.indexOf(uid);
        if (i < raiseOrder.length - 1) [raiseOrder[i], raiseOrder[i+1]] = [raiseOrder[i+1], raiseOrder[i]];
      }
      game.settings.set('raise-hand-carousel', 'order', raiseOrder);
      renderCarousel();
    };
  });

  // Drag-and-drop reorder (HTML5 API)
  container.querySelectorAll('.entry').forEach(entry => {
    entry.draggable = true;
    entry.ondragstart = e => {
      e.dataTransfer.setData('text/plain', entry.dataset.userId);
    };
    entry.ondragover = e => e.preventDefault();
    entry.ondrop = e => {
      const from = e.dataTransfer.getData('text/plain');
      const to = entry.dataset.userId;
      // Swap positions
      const a = raiseOrder.indexOf(from);
      const b = raiseOrder.indexOf(to);
      [raiseOrder[a], raiseOrder[b]] = [raiseOrder[b], raiseOrder[a]];
      game.settings.set('raise-hand-carousel', 'order', raiseOrder);
      renderCarousel();
    };
  });
}

// 6. Clean up on unload
Hooks.on('closeWorld', () => {
  document.getElementById('hand-carousel')?.remove();
});
