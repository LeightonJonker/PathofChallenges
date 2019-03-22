const electron = require('electron');
const url = require('url');
const path = require ('path');
//const bootstrap = require ('bootstrap');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// process environment
  process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

//////////////////////////// Main window; listen for app to be ready
app.on('ready', function(){
    // make window
    mainWindow = new BrowserWindow({
        width:1400,
        height: 1000,
        show: false
    });
    // mainWindow.setIcon('assets/icons/win/icon.png');
    // load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "mainWindow.html"),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('ready-to-show', () =>{
        mainWindow.show();
    });
    //when quit app, everything else quits
    mainWindow.on('closed', function(){
        app.quit();
    })

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //insert
    Menu.setApplicationMenu(mainMenu);
});


///////////////////////AddWindow
function createAddWindow(){
    // make window
    addWindow = new BrowserWindow({
        width: 350,
        height: 400,
        title: 'Add Challenge'
    });
    // load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection: set to null every time
    addWindow.on('closed', function(){
        addWindow = null;
    })
}


////////////////////////// Catch item from box
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item);
    addWindow.close();

});



////////////////////////// menu template
const mainMenuTemplate = [

    {
        label: 'File',
        submenu:[
            // {
            //     label: "Add Challenge",
            //     click(){
            //         createAddWindow();
            //     }
            // },
            // {
            //     label: "Clear Challenges",
            //     click(){
            //         mainWindow.webContents.send('item:clear');
            //     }
            // },
            {
                label: "Quit",
                accelerator: process.platform == 'darwin'? 'Command+Q':
                'Ctrl+Q', 
                click(){
                    app.quit();
                }
            }
        ]
    }

];

//if mac, empty object
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Dev tools if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Dev Tools',
        
        submenu:[
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin'? 'Command+I':
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            } 
        ]
    });
}