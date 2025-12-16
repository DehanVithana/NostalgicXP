import { EVENTS } from '../utils/eventBus.js';
import { isMobileDevice } from '../utils/device.js';

// --- Constants & Configuration ---

const ALL_PROGRAMS_ITEMS_BASE = [
  {
    type: 'program',
    programName: 'about',
    icon: './assets/gui/desktop/user.webp',
    label: 'About Me'
  },
  {
    type: 'program',
    programName: 'projects',
    icon: './assets/gui/desktop/projects.webp',
    label: 'Projects'
  },
  {
    type: 'program',
    programName: 'resume',
    icon: './assets/gui/desktop/resume.webp',
    label: 'Resume'
  },
  {
    type: 'program',
    programName: 'contact',
    icon: './assets/gui/desktop/contact.webp',
    label: 'Contact'
  },
  { type: 'separator' },
  {
    type: 'program',
    programName: 'my-pictures',
    icon: './assets/gui/start-menu/photos.webp',
    label: 'My Pictures',
    disabled: false
  },
  {
    type: 'program',
    programName: 'mediaPlayer',
    icon: './assets/gui/start-menu/mediaPlayer.webp',
    label: 'Media Player',
    disabled: false
  },
  {
    type: 'program',
    programName: 'musicPlayer',
    icon: './assets/gui/start-menu/musicPlayer.webp',
    label: 'Music Player',
    disabled: true
  },
  {
    type: 'program',
    programName: 'notepad',
    icon: './assets/gui/start-menu/notepad.webp',
    label: 'Notepad',
    disabled: false
  },
  {
    type: 'program',
    programName: 'cmd',
    icon: './assets/gui/start-menu/cmd.webp',
    label: 'Command Prompt',
    disabled: false
  },
  { type: 'separator' }
];

const RECENTLY_USED_ITEMS = [
  {
    type: 'program',
    programName: 'adobe-creative-cloud',
    icon: './assets/gui/start-menu/vanity-apps/creative-cloud.webp',
    label: 'Adobe Creative Cloud',
    disabled: false
  },
  {
    type: 'program',
    programName: 'photoshop',
    icon: './assets/gui/start-menu/vanity-apps/photoshop.webp',
    label: 'Adobe Photoshop',
    disabled: false
  },
  {
    type: 'program',
    programName: 'premiere',
    icon: './assets/gui/start-menu/vanity-apps/premiere.webp',
    label: 'Adobe Premiere Pro',
    disabled: false
  },
  {
    type: 'program',
    programName: 'illustrator',
    icon: './assets/gui/start-menu/vanity-apps/illustrator.webp',
    label: 'Adobe Illustrator',
    disabled: false
  },
  {
    type: 'program',
    programName: 'xd',
    icon: './assets/gui/start-menu/vanity-apps/xd.webp',
    label: 'Adobe XD',
    disabled: false
  },
  {
    type: 'program',
    programName: 'indesign',
    icon: './assets/gui/start-menu/vanity-apps/indesign.webp',
    label: 'Adobe InDesign',
    disabled: false
  },
  {
    type: 'program',
    programName: 'wordpress',
    icon: './assets/gui/start-menu/vanity-apps/wordpress.webp',
    label: 'WordPress',
    disabled: false
  },
  {
    type: 'program',
    programName: 'vscode',
    icon: './assets/gui/start-menu/vanity-apps/vscode.webp',
    label: 'VS Code',
    disabled: false
  },
  {
    type: 'program',
    programName: 'figma',
    icon: './assets/gui/start-menu/vanity-apps/figma.webp',
    label: 'Figma',
    disabled: false
  },
  {
    type: 'program',
    programName: 'chatgpt',
    icon: './assets/gui/start-menu/vanity-apps/chatgpt.webp',
    label: 'ChatGPT',
    disabled: false
  }
];

let SOCIALS = [];
let systemAssets = null;

// --- Helper Functions ---

async function getSystemAssets() {
  if (systemAssets) return systemAssets;
  try {
    const response = await fetch('./system.json');
    systemAssets = await response.json();
    return systemAssets;
  } catch (error) {
    systemAssets = {};
    return systemAssets;
  }
}

async function loadSocials() {
  try {
    const response = await fetch('./info.json');
    const data = await response.json();
    SOCIALS = Array.isArray(data['socials']) ? data['socials'] : [];
    return data;
  } catch (error) {
    SOCIALS = [];
    return {};
  }
}

function buildMenuHTML(items, baseClass, extraClass) {
  return (
    '<ul' +
    (extraClass ? ' class="' + extraClass + '"' : '') +
    '>' +
    items
      .map((item) =>
        item.type === 'separator'
          ? '<li class="' + baseClass + '-separator"><hr></li>'
          : item.type === 'program'
          ? '<li class="' +
            baseClass +
            '-item' +
            (item.disabled ? ' disabled' : '') +
            '" data-action="open-program" data-program-name="' +
            item.programName +
            '" title="' +
            item.label +
            '"><img src="' +
            item.icon +
            '" alt="' +
            item.label +
            '">\n' +
            item.label +
            '</li>'
          : item.type === 'link'
          ? '<li class="' +
            baseClass +
            '-item" data-action="open-url" data-url="' +
            item.url +
            '" title="' +
            item.label +
            '"><img src="' +
            item.icon +
            '" alt="' +
            item.label +
            '">\n' +
            item.label +
            '</li>'
          : ''
      )
      .join('') +
    '</ul>'
  );
}

function attachMenuItemEffects(element, selector) {
  element.querySelectorAll(selector).forEach((item) => {
    item.addEventListener('mousedown', (e) => {
      e.preventDefault();
      item.classList.add('active');
    });
    ['mouseup', 'mouseleave', 'dragstart'].forEach((event) => {
      item.addEventListener(event, () => {
        item.classList.remove('menu-item-clicked');
      });
    });
  });
}

function getAllProgramsItems() {
  const items = [
    ...ALL_PROGRAMS_ITEMS_BASE,
    ...SOCIALS.map((social) => ({
      type: 'link',
      url: social.url,
      icon: social.icon
        ? './' + social.icon.replace(/^\.\//, '').replace(/^\//, '')
        : '',
      label: social.name
    }))
  ];

  if (isMobileDevice()) {
    const musicPlayer = items.find(
      (i) => i.type === 'program' && i.programName === 'musicPlayer'
    );
    if (musicPlayer) {
      musicPlayer.disabled = true;
    }
  }
  return items;
}

// --- Main Class ---

export default class StartMenu {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.startButton = document.getElementById('start-button');
    this.startMenu = null;
    this.allProgramsMenu = null;
    this.recentlyUsedMenu = null;
    this.activeWindowOverlay = null;
    this.infoData = {};
    this.systemAssets = null;
    
    // Initialize
    this._init();
    
    // Event Subscriptions
    this.eventBus.subscribe(EVENTS.TOGGLE_START_MENU, () =>
      this.toggleStartMenu()
    );
    
    this.eventBus.subscribe(EVENTS.CLOSE_START_MENU, () => {
      if (
        this.startMenu?.classList.contains('active')
      ) {
        this.closeStartMenu();
      }
    });

    this.eventBus.subscribe(EVENTS.WINDOW_OPENED, (data) => {
      this._handleOverlay(data?.id);
    });
  }

  async _init() {
    this.infoData = await loadSocials();
    this.systemAssets = await getSystemAssets();
    this.createStartMenuElement();
    this.setupEventListeners();
  }

  createStartMenuElement() {
    // Remove existing menu if present
    const existingMenu = document.querySelector('.startmenu');
    if (existingMenu) existingMenu.parentNode.removeChild(existingMenu);

    const startMenu = document.createElement('div');
    startMenu.className = 'startmenu';
    startMenu.innerHTML = this.getMenuTemplate();
    startMenu.style.visibility = 'hidden';
    startMenu.style.opacity = '0';
    
    document.body.appendChild(startMenu);
    this.startMenu = startMenu;

    // Set User Name
    const userName = this.infoData?.contact?.name || 'User';
    startMenu.querySelectorAll('.menutopbar .username').forEach((el) => {
      el.innerText = userName;
    });

    this.createAllProgramsMenu();
    this.createRecentlyUsedMenu();
    this.setupMenuItems();
    this._attachMenuClickListeners();
  }

  _createSubMenu(id, html, propertyName) {
    if (!this[propertyName]) {
      const el = document.createElement('div');
      el.className = id;
      el.innerHTML = html;
      el.style.display = 'none';
      document.body.appendChild(el);
      this[propertyName] = el;
    }
    return this[propertyName];
  }

  _createMenuWithEffects({
    items,
    itemClass,
    ulClass,
    menuClass,
    propertyName,
    itemSelector,
    attachClickHandler
  }) {
    const html = buildMenuHTML(items, itemClass, ulClass);
    const menu = this._createSubMenu(menuClass, html, propertyName);
    
    attachMenuItemEffects(menu, itemSelector);
    
    if (attachClickHandler) {
      menu.addEventListener('click', this._handleMenuClick.bind(this));
    }
    return menu;
  }

  createAllProgramsMenu() {
    this._createMenuWithEffects({
      items: getAllProgramsItems(),
      itemClass: 'all-programs',
      ulClass: 'all-programs-list',
      menuClass: 'all-programs-menu',
      propertyName: 'allProgramsMenu',
      itemSelector: '.all-programs-item',
      attachClickHandler: true
    });
  }

  createRecentlyUsedMenu() {
    this._createMenuWithEffects({
      items: RECENTLY_USED_ITEMS,
      itemClass: 'recently-used',
      ulClass: 'recently-used-list',
      menuClass: 'recently-used-menu',
      propertyName: 'recentlyUsedMenu',
      itemSelector: '.recently-used-item',
      attachClickHandler: true
    });
  }

  getMenuTemplate() {
    // Internal helper to build individual list items
    function buildItem({
      id,
      icon,
      title,
      description,
      programName,
      action,
      url,
      disabledOverride
    }) {
      const isDisabled =
        typeof disabledOverride === 'boolean'
          ? disabledOverride
          : ['mediaPlayer', 'musicPlayer', 'notepad', 'cmd'].includes(
              programName
            );

      return (
        '<li class="menu-item' +
        (isDisabled ? ' disabled' : '') +
        '" id="menu-' +
        (programName || id) +
        '" ' +
        (isDisabled ? '' : action ? 'data-action="' + action + '"' : '') +
        ' ' +
        (isDisabled
          ? ''
          : programName
          ? 'data-program-name="' + programName + '"'
          : '') +
        ' ' +
        (url ? 'data-url="' + url + '"' : '') +
        ' tabindex="' +
        (isDisabled ? '-1' : '0') +
        '" aria-disabled="' +
        (isDisabled ? 'true' : 'false') +
        '" title="' +
        icon +
        ' - ' +
        title +
        '">\n' +
        '        <div class="item-content">\n' +
        '          ' +
        ('<span class="item-title' +
          ('projects' === (programName || id) ? ' bold' : '') +
          '">' +
          title +
          '</span>') +
        '\n' +
        '          ' +
        (description
          ? '<span class="item-description">' + description + '</span>'
          : '') +
        '\n' +
        '        </div>\n' +
        '      </li>'
      );
    }

    const isMobile = isMobileDevice();
    const userIcon = this.systemAssets?.userIcon || './assets/gui/user.png';
    const userName = this.infoData?.contact?.name || 'User';

    // Map socials from JSON to menu items
    const socialItems = SOCIALS.map((s) => ({
      id: s.key,
      icon: s.icon
        ? './' + s.icon.replace(/^\.\//, '').replace(/^\//, '')
        : '',
      title: s.name,
      url: s.url,
      action: 'open-url',
      disabledOverride: false
    }));

    // Define main menu items
    const mainItems = [
      {
        id: 'mediaPlayer',
        icon: './assets/gui/start-menu/mediaPlayer.webp',
        title: 'Media Player',
        programName: 'mediaPlayer',
        action: 'open-program',
        disabledOverride: false
      },
      {
        id: 'my-pictures',
        icon: './assets/gui/start-menu/photos.webp',
        title: 'My Pictures',
        programName: 'my-pictures',
        action: 'open-program',
        disabledOverride: false
      },
      {
        id: 'musicPlayer',
        icon: './assets/gui/start-menu/musicPlayer.webp',
        title: 'Music Player',
        programName: 'musicPlayer',
        action: 'open-program',
        disabledOverride: isMobileDevice()
      }
    ];

    let item1, item2, item3, item4, item5, item6;

    // Adjust layout based on device
    if (isMobile) {
      item1 = mainItems[2];
      item2 = mainItems[1];
      item3 = mainItems[0];
      item4 = socialItems[0];
      item5 = socialItems[1];
      item6 = socialItems[2];
    } else {
      item1 = mainItems[1];
      item2 = mainItems[2];
      item3 = mainItems[0];
      item4 = socialItems[0];
      item5 = socialItems[1];
      item6 = socialItems[2];
    }

    const notepadItem = {
      id: 'notepad',
      icon: './assets/gui/start-menu/notepad.webp',
      title: 'Notepad',
      programName: 'notepad',
      action: 'open-program'
    };
    
    const cmdItem = {
      id: 'cmd',
      icon: './assets/gui/start-menu/cmd.webp',
      title: 'Command Prompt',
      programName: 'cmd',
      action: 'open-program'
    };

    const recentlyUsedHtml =
      '\n      <li class="menu-item" id="menu-program4" data-action="toggle-recently-used">\n        <img src="./assets/gui/start-menu/recently-used.webp" alt="Recently Used">\n        <div class="item-content">\n          <span class="item-title">Recently Used</span>\n        </div>\n      </li>';

    let listContent;
    if (isMobile) {
      listContent =
        '\n        ' +
        buildItem(item4) +
        '\n        ' +
        buildItem(item5) +
        '\n        ' +
        buildItem(item6) +
        '\n        <li class="menu-divider divider-darkblue"><hr class="divider"></li>\n        ' +
        buildItem(notepadItem) +
        '\n        ' +
        buildItem(cmdItem) +
        '\n        ' +
        recentlyUsedHtml +
        '\n        <li class="menu-divider divider-darkblue"><hr class="divider"></li>\n        ' +
        buildItem(item1) +
        '\n        ' +
        buildItem(item2) +
        '\n        ' +
        buildItem(item3) +
        '\n      ';
    } else {
      listContent =
        '\n        ' +
        buildItem(item4) +
        '\n        ' +
        buildItem(item5) +
        '\n        ' +
        buildItem(item6) +
        '\n        <li class="menu-divider divider-darkblue"><hr class="divider"></li>\n        ' +
        buildItem(notepadItem) +
        '\n        ' +
        buildItem(cmdItem) +
        '\n        <li class="menu-divider divider-darkblue"><hr class="divider"></li>\n        ' +
        recentlyUsedHtml +
        '\n      ';
    }

    return (
      '\n      <div class="menutopbar">\n        <img src="' +
      userIcon +
      '" alt="User" class="userpicture">\n        <span class="username">' +
      userName +
      '</span>\n      </div>\n      <ul class="start-menu-list">\n        ' +
      buildItem({
        id: 'projects',
        icon: './assets/gui/desktop/projects.webp',
        title: 'Projects',
        description: 'See my work',
        programName: 'projects',
        action: 'open-program'
      }) +
      '\n        ' +
      buildItem({
        id: 'contact',
        icon: './assets/gui/desktop/contact.webp',
        title: 'Contact',
        description: 'Send me a message',
        programName: 'contact',
        action: 'open-program'
      }) +
      '\n        ' +
      buildItem({
        id: 'about',
        icon: './assets/gui/desktop/user.webp',
        title: 'About Me',
        programName: 'about',
        action: 'open-program'
      }) +
      '\n            ' +
      buildItem({
        id: 'resume',
        icon: './assets/gui/desktop/resume.webp',
        title: 'Resume',
        programName: 'resume',
        action: 'open-program'
      }) +
      '\n            ' +
      buildItem({
        id: item1.id,
        icon: item1.icon,
        title: item1.title,
        programName: item1.programName,
        action: item1.action,
        url: item1.url,
        disabledOverride: item1.disabledOverride
      }) +
      '\n            ' +
      buildItem({
        id: item2.id,
        icon: item2.icon,
        title: item2.title,
        programName: item2.programName,
        action: item2.action,
        url: item2.url,
        disabledOverride: item2.disabledOverride
      }) +
      '\n            ' +
      buildItem({
        id: item3.id,
        icon: item3.icon,
        title: item3.title,
        programName: item3.programName,
        action: item3.action,
        url: item3.url,
        disabledOverride: item3.disabledOverride
      }) +
      listContent +
      '\n        <li class="menu-divider divider-darkblue"><hr class="divider"></li>\n        <li class="menu-item" id="menu-all-programs" data-action="toggle-all-programs">\n          <div class="item-content">\n            <span class="item-title bold">All Programs</span>\n            <span class="arrow">▶</span>\n          </div>\n        </li>\n        <li class="menu-divider divider-darkblue"><hr class="divider"></li>\n        <li class="menu-item" data-action="log-off">\n           <img src="./assets/gui/start-menu/log-off.webp" alt="Log Off">\n           <div class="item-content">\n             <span class="item-title">Log Off</span>\n           </div>\n        </li>\n        <li class="menu-item" data-action="shut-down">\n           <img src="./assets/gui/start-menu/shut-down.webp" alt="Turn Off Computer">\n           <div class="item-content">\n             <span class="item-title">Turn Off Computer</span>\n           </div>\n        </li>\n      </ul>\n      <div class="start-menu-footer">\n      </div>\n    '
    );
  }

  setupEventListeners() {
    // Window click logic to close menu when clicking outside
    window.addEventListener(
      'mousedown',
      (e) => {
        if (!this.startMenu?.classList.contains('active')) return;
        const target = e.target;

        if (
          target.classList.contains('start-menu-content-click-overlay') ||
          target.tagName === 'IFRAME'
        )
          return;

        const isStartMenu = this.startMenu.contains(target);
        const isStartButton = this.startButton.contains(target);
        const isAllPrograms = this.allProgramsMenu?.contains(target);
        const isRecentlyUsed = this.recentlyUsedMenu?.contains(target);

        if (
          !isStartMenu &&
          !isStartButton &&
          !isAllPrograms &&
          !isRecentlyUsed
        ) {
          e.stopPropagation();
          e.preventDefault();
          this.hideAllProgramsMenu();
          this.closeStartMenu();
        }
      },
      true
    );

    // Keyboard support (Windows key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Meta') {
        if (this.startMenu?.classList.contains('active')) {
          this.closeStartMenu();
        }
      }
    });
  }

  _handleMenuClick(e) {
    const item = e.target.closest(
      '[data-action], [data-program-name], [data-url]'
    );
    if (!item) return;

    if (
      item.classList.contains('all-programs-item') &&
      item.classList.contains('disabled')
    ) {
      e.stopPropagation();
      return void e.preventDefault();
    }

    if (
      item.classList.contains('recently-used-item') &&
      item.classList.contains('disabled')
    ) {
      e.stopPropagation();
      return void e.preventDefault();
    }

    const action = item.dataset.action;
    const programName = item.dataset.programName;
    const url = item.dataset.url;

    if (action === 'toggle-all-programs') {
      // Handled by hover mostly, but logic here if needed
    } else if (action === 'open-program' && programName) {
      this.openProgram(programName);
      this.closeStartMenu();
    } else if (action === 'open-url' && url) {
      window.open(url, '_blank');
      this.closeStartMenu();
    } else if (action === 'log-off') {
      this.eventBus.publish(EVENTS.SHOW_DIALOG, { dialogType: 'logOff' });
      this.closeStartMenu();
    } else if (action === 'shut-down') {
      this.eventBus.publish(EVENTS.SHOW_DIALOG, { dialogType: 'shutDown' });
      this.closeStartMenu();
    } else if (action === 'toggle-recently-used') {
      this.showRecentlyUsedMenu();
    }
  }

  _attachMenuClickListeners() {
    this.startMenu &&
      this.startMenu.addEventListener(
        'click',
        this._handleMenuClick.bind(this)
      );
  }

  setupMenuItems() {
    this.setupAllProgramsMenu();
    // Recently Used Setup
    const recentlyUsedItem = this.startMenu.querySelector(
      '#menu-program4'
    );
    if (recentlyUsedItem) {
        // Logic to add the arrow and hover listeners for submenus
      recentlyUsedItem.setAttribute('data-action', 'toggle-recently-used');
      recentlyUsedItem.style.position = 'relative';
      recentlyUsedItem.style.width = '100%';
      
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.innerHTML = '►';
      arrow.style.position = 'absolute';
      arrow.style.right = '8px';
      arrow.style.top = '50%';
      arrow.style.transform = 'translateY(-50%)';
      arrow.style.fontSize = '10px';
      
      recentlyUsedItem.appendChild(arrow);
      recentlyUsedItem.addEventListener('mouseenter', () =>
        this.showRecentlyUsedMenu()
      );
      recentlyUsedItem.addEventListener('mouseleave', (e) => {
        if (
          e.relatedTarget &&
          (e.relatedTarget.closest('.recently-used-menu') ||
            e.relatedTarget === this.recentlyUsedMenu)
        ) {
            // do nothing
        } else {
            this.hideRecentlyUsedMenu();
        }
      });
    }
  }

  setupAllProgramsMenu() {
    const allProgramsBtn = document.getElementById('menu-all-programs');
    if (!allProgramsBtn || !this.allProgramsMenu || !this.startMenu) return;

    allProgramsBtn.addEventListener('mouseenter', () =>
      this.showAllProgramsMenu()
    );

    allProgramsBtn.addEventListener('mouseleave', (e) => {
      if (
        e.relatedTarget &&
        (e.relatedTarget.closest('.all-programs-menu') ||
          e.relatedTarget === this.allProgramsMenu)
      ) {
          // Do nothing
      } else {
        this.hideAllProgramsMenu();
      }
    });

    this.allProgramsMenu.addEventListener('mouseleave', (e) => {
      if (
        e.relatedTarget &&
        (e.relatedTarget === allProgramsBtn ||
          e.relatedTarget.closest('#menu-all-programs'))
      ) {
          // Do nothing
      } else {
        this.hideAllProgramsMenu();
      }
    });

    // Close all programs if hovering other main menu items
    this.startMenu
      .querySelectorAll('.menu-item:not(#menu-all-programs), .menutopbar, .start-menu-footer, .middle-right')
      .forEach((el) => {
        el.addEventListener('mouseenter', () => this.hideAllProgramsMenu());
      });
  }

  showAllProgramsMenu() {
    if (!this.allProgramsMenu || !this.startMenu) return;
    const parentItem = this.startMenu.querySelector('#menu-all-programs');
    const startMenuBody = this.startMenu.querySelector('.start-menu-list');
    
    if (!parentItem || !startMenuBody) return;

    const parentRect = parentItem.getBoundingClientRect();
    const menuRect = startMenuBody.getBoundingClientRect();
    
    const leftPos = parentRect.right + 'px';
    const bottomPos = window.innerHeight - menuRect.bottom + 'px';

    Object.assign(this.allProgramsMenu.style, {
      left: leftPos,
      bottom: bottomPos,
      top: 'auto',
      display: 'block'
    });
    
    this.allProgramsMenu.classList.add('active');
  }

  hideAllProgramsMenu() {
    if (this.allProgramsMenu) {
      this.allProgramsMenu.classList.remove('active');
      this.allProgramsMenu.style.display = 'none';
    }
  }

  openProgram(programName) {
    this.eventBus.publish(EVENTS.OPEN_PROGRAM, { programName: programName });
  }

  toggleStartMenu() {
    if (!this.startMenu) return;

    if (this.startMenu.classList.contains('active')) {
      this.closeStartMenu();
    } else {
      this.startMenu.style.visibility = 'visible';
      this.startMenu.style.opacity = '1';
      this.startMenu.classList.add('active');
      this.eventBus.publish(EVENTS.STARTMENU_OPENED);
      
      const activeWin = document.querySelector('.window.active');
      this._handleOverlay(activeWin?.id);
      
      this.attachIframeFocusListeners();
      this.attachWindowBlurListener();
    }
  }

  closeStartMenu() {
    const isActive = this.startMenu?.classList.contains('active');
    if (this.startMenu && isActive) {
      this.startMenu.classList.remove('active');
      this.hideAllProgramsMenu();
      this._handleOverlay(null);
      this.removeIframeFocusListeners();
      this._removeWindowBlurListener();
      
      // Fade out animation
      requestAnimationFrame(() => {
        this.startMenu.style.visibility = 'hidden';
        this.startMenu.style.opacity = '0';
      });
      
      this.eventBus.publish(EVENTS.STARTMENU_CLOSED);
      this.hideRecentlyUsedMenu();
    }
  }

  _handleOverlay(windowId) {
    if (this.activeWindowOverlay) {
      this.activeWindowOverlay.style.display = 'none';
      this.activeWindowOverlay.style.pointerEvents = 'none';
      this.activeWindowOverlay = null;
    }

    let targetOverlay = null;
    if (windowId) {
      const winEl = document.getElementById(windowId);
      if (winEl) {
        targetOverlay = winEl.querySelector('.start-menu-content-click-overlay');
      }
    }

    if (targetOverlay && this.startMenu?.classList.contains('active')) {
      targetOverlay.style.display = 'block';
      targetOverlay.style.pointerEvents = 'auto';
      this.activeWindowOverlay = targetOverlay;
    } else if (targetOverlay) {
      targetOverlay.style.display = 'none';
      targetOverlay.style.pointerEvents = 'none';
    }
  }

  showRecentlyUsedMenu() {
    if (!this.recentlyUsedMenu || !this.startMenu) return;
    const triggerItem = this.startMenu.querySelector('#menu-program4');
    if (!triggerItem) return;

    this.recentlyUsedMenu.style.visibility = 'hidden';
    this.recentlyUsedMenu.style.display = 'block';

    const triggerRect = triggerItem.getBoundingClientRect();
    const menuRect = this.recentlyUsedMenu.getBoundingClientRect();

    let leftPos = triggerRect.right;
    // Keep within screen bounds
    if (leftPos + menuRect.width > window.innerWidth) {
      leftPos = triggerRect.left - menuRect.width;
    }

    let topPos = triggerRect.top - menuRect.height;
    if (topPos < 0) topPos = 0;
    
    if (topPos + menuRect.height > window.innerHeight - 30) {
        topPos = window.innerHeight - 30 - menuRect.height;
    }

    Object.assign(this.recentlyUsedMenu.style, {
      left: leftPos + 'px',
      top: topPos + 'px',
      display: 'block',
      visibility: 'visible'
    });

    this.recentlyUsedMenu.addEventListener('mouseleave', (e) => {
      if (
        e.relatedTarget &&
        (e.relatedTarget === triggerItem ||
          e.relatedTarget.closest('#menu-program4'))
      ) {
          // Do nothing
      } else {
        this.hideRecentlyUsedMenu();
      }
    });

    this.recentlyUsedMenu.classList.add('mut-menu-active');
    triggerItem.classList.add('active-submenu-trigger');
  }

  hideRecentlyUsedMenu() {
    if (this.recentlyUsedMenu) {
      this.recentlyUsedMenu.classList.remove('mut-menu-active');
      this.recentlyUsedMenu.style.display = 'none';
    }
    const triggerItem = this.startMenu?.querySelector('#menu-program4');
    triggerItem?.classList.remove('active-submenu-trigger');
  }

  attachIframeFocusListeners() {
    this._iframeFocusHandler = () => this.closeStartMenu();
    document.querySelectorAll('iframe').forEach((iframe) => {
      iframe.addEventListener('focus', this._iframeFocusHandler);
    });
  }

  removeIframeFocusListeners() {
    if (this._iframeFocusHandler) {
      document.querySelectorAll('iframe').forEach((iframe) => {
        iframe.removeEventListener('focus', this._iframeFocusHandler);
      });
      this._iframeFocusHandler = null;
    }
  }

  attachWindowBlurListener() {
    this._windowBlurHandler = () => this.closeStartMenu();
    window.addEventListener('blur', this._windowBlurHandler);
  }

  _removeWindowBlurListener() {
    if (this._windowBlurHandler) {
      window.removeEventListener('blur', this._windowBlurHandler);
      this._windowBlurHandler = null;
    }
  }
}
