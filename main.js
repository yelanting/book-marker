const { app, BrowserWindow } = require("electron");

let mainWindow = null;

app.on("ready", () => {
	console.log("Hello From Electron");
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true, // 是否集成 Nodejs,把之前预加载的js去了，发现也可以运行
		},
	});
	mainWindow.webContents.loadFile("./index.html");
});
