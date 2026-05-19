const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');

app.setName('My Google Keep');

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800,
    fullScreen: true,
    maximize: true,
  });

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: true,
    fullscreenable: true,
    show: false,
  });

  win.loadURL('https://keep.google.com/');

  win.webContents.on('did-finish-load', () => {
    win.setTitle('My Google Keep');
  });

  win.once('ready-to-show', () => {
    win.show();
  });

  mainWindowState.manage(win);

  // --- Меню без Edit ---
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    // Пункт Edit полностью удалён
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About My Google Keep',
          click: () => {
            dialog.showMessageBox(win, {
              type: 'info',
              title: 'About My Google Keep',
              message: 'My Google Keep',
              detail: 'Version: 0.1 beta\n\nUnofficial desktop client for Google Keep\n\nAuthor: MNTR\nLicense: MIT\n\nThis app is not affiliated with Google.',
              buttons: ['OK']
            });
          }
        },
        {
          label: 'GitHub Repository',
          click: () => shell.openExternal('https://github.com/mntrofficial/my-google-keep') // ← Замените на реальный URL после создания репозитория
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});