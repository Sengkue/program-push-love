const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false // Allow local API calls
    },
    icon: path.join(__dirname, 'icon.png'), // Add your app icon
    titleBarStyle: 'default',
    show: false // Don't show until ready
  });

  // Load the HTML file
  mainWindow.loadFile('src/renderer/index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Optional: Open DevTools in development
  // mainWindow.webContents.openDevTools();

  // Handle window closed
  mainWindow.on('closed', () => {
    app.quit();
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh Files',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.reload();
          }
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'F12',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools();
          }
        },
        {
          label: 'Actual Size',
          accelerator: 'CmdOrCtrl+0',
          click: () => {
            BrowserWindow.getFocusedWindow()?.webContents.setZoomLevel(0);
          }
        },
        {
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (window) {
              const currentZoom = window.webContents.getZoomLevel();
              window.webContents.setZoomLevel(currentZoom + 0.5);
            }
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-',
          click: () => {
            const window = BrowserWindow.getFocusedWindow();
            if (window) {
              const currentZoom = window.webContents.getZoomLevel();
              window.webContents.setZoomLevel(currentZoom - 0.5);
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});