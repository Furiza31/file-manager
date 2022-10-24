const fs = require('fs');
const path = require('path');

class Workspace {
    constructor() {
        
    }

    isCreated() {
        return fs.existsSync(path.join(__dirname, '../workspace'));
    }

}

module.exports = Workspace;