module.exports = function(msg, config) {
  const $ = require('cheerio');
  const puppeteer = require('puppeteer');

  var team_url = msg.content.replace(config.commandPrefix + "check ", "");

  puppeteer
    .launch()
    .then(function(browser) {
      return browser.newPage();
    })
    .then(function(page) {
      return page.goto(team_url).then(function() {
        return page.content();
      });
    })
    .then(function(html) {
      var tags = [];
      $('div .ign-text', html).each(function() {
        tags.push($(this).text())
      });
      msg.channel.send(tags);
    })
    .catch(function(err) {
      //handle error
    });
}
