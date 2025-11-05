const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('=================================================');
console.log('   Work Pipeline - Starting Application...      ');
console.log('=================================================\n');

// Function to check if Node.js is installed
const checkNodeInstalled = () => {
    return new Promise((resolve) => {
        exec('node --version', (error, stdout) => {
            if (error) {
                console.log('❌ Node.js is not installed.');
                resolve(false);
            } else {
                console.log('✅ Node.js is installed:', stdout.trim());
                resolve(true);
            }
        });
    });
};

// Function to check if dependencies are installed
const checkDependencies = () => {
    return fs.existsSync(path.join(__dirname, 'node_modules'));
};

// Function to install dependencies
const installDependencies = () => {
    return new Promise((resolve, reject) => {
        console.log('\n📦 Installing dependencies... This may take a few minutes.\n');
        
        const npmInstall = spawn('npm', ['install'], {
            cwd: __dirname,
            shell: true,
            stdio: 'inherit'
        });

        npmInstall.on('close', (code) => {
            if (code === 0) {
                console.log('\n✅ Dependencies installed successfully!\n');
                resolve();
            } else {
                console.error('\n❌ Failed to install dependencies.');
                reject(new Error('npm install failed'));
            }
        });
    });
};

// Function to start the development server
const startServer = () => {
    return new Promise((resolve) => {
        console.log('🚀 Starting development server...\n');
        
        const server = spawn('npm', ['run', 'dev'], {
            cwd: __dirname,
            shell: true,
            stdio: 'pipe'
        });

        let urlOpened = false;

        server.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(output);
            
            // Look for the Local URL in the output
            if (!urlOpened && output.includes('Local:')) {
                const match = output.match(/Local:\s+(http:\/\/[^\s]+)/);
                if (match) {
                    const url = match[1].trim();
                    console.log(`\n✅ Server started successfully!`);
                    console.log(`🌐 Opening browser at: ${url}\n`);
                    
                    // Wait a moment then open browser
                    setTimeout(() => {
                        exec(`start ${url}`, (error) => {
                            if (error) {
                                console.log('⚠️  Could not auto-open browser. Please open:', url);
                            }
                        });
                    }, 1000);
                    
                    urlOpened = true;
                }
            }
        });

        server.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        server.on('close', (code) => {
            console.log(`\n⚠️  Server stopped with code ${code}`);
            console.log('Press any key to exit...');
        });

        // Keep the process running
        process.stdin.resume();
    });
};

// Main execution
(async () => {
    try {
        // Step 1: Check Node.js
        const nodeInstalled = await checkNodeInstalled();
        
        if (!nodeInstalled) {
            console.log('\n⚠️  Please install Node.js from: https://nodejs.org/');
            console.log('After installation, run this script again.\n');
            console.log('Press any key to exit...');
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('data', process.exit.bind(process, 0));
            return;
        }

        // Step 2: Check and install dependencies
        if (!checkDependencies()) {
            console.log('📦 Dependencies not found. Installing...\n');
            await installDependencies();
        } else {
            console.log('✅ Dependencies already installed.\n');
        }

        // Step 3: Start the server
        await startServer();

        console.log('\n=================================================');
        console.log('   Application is running!                       ');
        console.log('   Keep this window open to use the app.         ');
        console.log('   Press Ctrl+C to stop the server.              ');
        console.log('=================================================\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\nPress any key to exit...');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 1));
    }
})();