module.exports = function(msg, config) {
  const $ = require('cheerio');
  const puppeteer = require('puppeteer');
  const overwatch = require('overwatch-api');

  var team_url = msg.content.replace(config.commandPrefix + "check ", "");

  msg.channel.send("Searching for team at: " + team_url)

  puppeteer
    .launch()
    .then(function(browser) {
      return browser.newPage();
    })
    .then(function(page) {
      return page.goto(team_url).then(async function() {
        await page.waitFor('.ign-text');
        const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document));
        return renderedContent;
      });
    })
    .then(async function(html) {
      var tags = [];

      var tagbytes = await $('div .ign-text', html);

      tagbytes.each(function() {
        tags.push($(this).text().replace('#', '-'));
      })

      return tags;

    }).then(async function(tags){
      var sr = [];

      const getProfilePromise = require('util').promisify(overwatch.getProfile);

      async function processTags(tags) {
        // map array to promises
        const promises = tags.map(tag => getProfilePromise('pc', 'eu', tag));
        // wait until all promises are resolved
        await Promise.all(promises).then(function(profiles){
          sr = profiles.filter(profile => !isNaN(profile.competitive.rank)).map(profile => profile.competitive.rank)
        })
      }

      await processTags(tags)

      sr.sort((a, b) => a - b);

      var min = Math.min(...sr),
      max = Math.max(...sr),
      avg = (sr.reduce((a, b) => a += b)/sr.length).toFixed(0),
      median =  (sr[(sr.length - 1) >> 1] + sr[sr.length >> 1]) / 2

      msg.channel.send('Mean SR: ' + avg + '\nMedian SR: ' + median + '\nMaximum SR: ' + max + '\nMinimum SR: ' + min + '\nSR Values: ' + sr)
    })
    .catch(function(err) {
      //handle error
    });
}
