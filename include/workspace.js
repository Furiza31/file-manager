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
                            let regexClasses = /^[RS]\d[\.A-Z\d]+.*/;
                            let regexCourses = /course=[\d]+/;
                            let data = [];
                            // get all li elements from #region-main > div > div > div > section:nth-child(3) > div > ul > li > dl > dd > ul
                            $("#region-main > div > div > div > section:nth-child(3) > div > ul > li > dl > dd > ul > li").each((index, element) => {
                                // get the text of the element
                                let text = $(element).text().trim();
                                // if the text match the regexClasses
                                if (regexClasses.test(text)) {
                                    // get the link of the element
                                    let link = $(element).find('a').attr('href');
                                    // push the class in the classes array
                                    data.push({
                                        name: text,
                                        link: 'https://webetud.iut-blagnac.fr/course/view.php?id=' + link.match(regexCourses)[0].split('=')[1]
                                    });
                                }
                            });
                            resolve(data);
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