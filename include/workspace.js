const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

class Workspace {
    constructor() {
        
    }

    isCreated() {
        return fs.existsSync(path.join(__dirname, '../workspace'));
    }

}

const getClasses = (cookie) => {
    return new Promise((resolve, reject) => {
        // request to https://webetud.iut-blagnac.fr/ with MoodleSession cookie
        request({
            url: 'https://webetud.iut-blagnac.fr/',
            method: 'GET',
            headers: {
                'Cookie': `MoodleSession=${cookie}`
            }
        }, (error, response, body) => {
            if (error) reject(error);
            else {
                if (response.statusCode == 200) {
                    let $ = cheerio.load(body);
                    request({
                        url: $("#action-menu-1-menu > a:nth-child(3)").attr('href') + "&showallcourses=1",
                        method: 'GET',
                        headers: {
                            'Cookie': `MoodleSession=${cookie}`
                        }
                    }, (error, response, body) => {
                        if (error) reject(error);
                        else {
                            let $ = cheerio.load(body);
                            let regex = /^[SR]\d\.\d{2}.*/g
                            let classes = [];
                            // get all li elements from #region-main > div > div > div > section:nth-child(3) > div > ul > li > dl > dd > ul
                            $("#region-main > div > div > div > section:nth-child(3) > div > ul > li > dl > dd > ul > li").each((index, element) => {
                                // get the text of the element
                                let text = $(element).text();
                                // if the text match the regex
                                if (regex.test(text)) {
                                    // get the link of the element
                                    let link = $(element).find('a').attr('href');
                                    // push the class in the classes array
                                    classes.push({
                                        name: text,
                                        link: link
                                    });
                                }
                            });
                            resolve(classes);
                        }
                    });
                }
            }
        });
    });
}

module.exports = {
    getClasses,
    Workspace
};