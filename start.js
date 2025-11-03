const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if Node.js is installed
const checkNodeInstalled = () => {
    try {
        exec('node --version', (error, stdout, stderr) => {
            if (error) {
                console.log('Node.js is not installed. Installing Node.js...');
                installNode();
            } else {
                console.log('Node.js is installed:', stdout);
                startApplication();
            }
        });
    } catch (error) {
        console.log('Error checking Node.js:', error);
        installNode();
    }
};

// Function to install Node.js
const installNode = () => {
    // Download Node.js installer
    const https = require('https');
    const nodeInstallerPath = path.join(process.env.TEMP, 'node_installer.msi');
    
    console.log('Downloading Node.js installer...');
    const file = fs.createWriteStream(nodeInstallerPath);
    
    https.get('https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi', (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Installing Node.js...');
            
            // Run the installer
            exec(`msiexec /i "${nodeInstallerPath}" /quiet /qn`, (error) => {
                if (error) {
                    console.error('Error installing Node.js:', error);
                    return;
                }
                console.log('Node.js installed successfully');
                startApplication();
            });
        });
    });
};

// Function to start the application
const startApplication = () => {
    console.log('Starting Work Pipeline application...');
    
    // Install dependencies if needed
    if (!fs.existsSync('node_modules')) {
        console.log('Installing dependencies...');
        exec('npm install', (error) => {
            if (error) {
                console.error('Error installing dependencies:', error);
                return;
            }
            runDev();
        });
    } else {
        runDev();
    }
};

// Function to run the development server
const runDev = () => {
    console.log('Starting development server...');
    const server = exec('npm run dev', (error) => {
        if (error) {
            console.error('Error starting server:', error);
            return;
        }
    });

    // Open browser after server starts
    server.stdout.on('data', (data) => {
        if (data.includes('Local:')) {
            const url = data.match(/Local:\s*(http:\/\/[^\s]+)/)[1];
            exec(`start ${url}`);
        }
    });
};

// Start the process
checkNodeInstalled();