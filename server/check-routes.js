/**
 * This script checks all route mappings in your Express app
 * Run with: node check-routes.js
 */
require('dotenv').config();
const express = require('express');
const chalk = require('chalk') || { green: text => text, red: text => text, yellow: text => text, blue: text => text };
const fs = require('fs');
const path = require('path');

function getRoutes() {
  try {
    // Use fs to read the routes directory
    const routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));
    
    console.log(chalk.blue('Found route files:'));
    routeFiles.forEach(file => {
      if (file.endsWith('.js')) {
        console.log(` - ${file}`);
      }
    });
    
    // Create a test app to extract routes
    const app = express();
    
    // Register all routes
    routeFiles.forEach(file => {
      if (file.endsWith('.js')) {
        const routeName = file.replace('.js', '');
        const apiPrefix = `/api/${routeName}`;
        
        try {
          const route = require(`./routes/${file}`);
          app.use(apiPrefix, route);
          console.log(chalk.green(`✓ Registered ${apiPrefix}`));
          
          // Try to list the subroutes if possible
          if (route.stack) {
            route.stack.forEach(layer => {
              if (layer.route) {
                const method = Object.keys(layer.route.methods)[0].toUpperCase();
                console.log(`   - ${method} ${apiPrefix}${layer.route.path}`);
              }
            });
          }
        } catch (err) {
          console.error(chalk.red(`✗ Failed to load ${file}: ${err.message}`));
        }
      }
    });
    
    return 'Route check completed';
  } catch (error) {
    console.error('Error checking routes:', error);
    return `Error: ${error.message}`;
  }
}

// Run the check
getRoutes();
