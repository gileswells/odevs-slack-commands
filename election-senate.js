var { JSDOM } = require('jsdom');
var request = require('request');
var response_url;

module.exports = function (context, req, res) {
    request(
        'https://floridaelectionwatch.gov/FederalOffices/USSenator',
        function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.

            const dom = new JSDOM(body);
            const rows = dom.window.document.querySelectorAll('.grid-row')

            var repCount = parseInt(rows[0].querySelector('span').textContent.replace(",", "").replace(",", ""))
            var repPercent = rows[0].querySelector('.progressbar').textContent

            var demCount = parseInt(rows[1].querySelector('span').textContent.replace(",", "").replace(",", ""))
            var demPercent = rows[1].querySelector('.progressbar').textContent

            var diffCount = Math.abs(repCount - demCount)
            var diffPercent = ((diffCount / (repCount + demCount))*100).toFixed(2)

            var output = '';
            output += 'Scott - ' + repPercent + ' - ' + repCount.toLocaleString('us') + "\n"
            output += 'Nelson - ' + demPercent + ' - ' +  demCount.toLocaleString('us') + "\n"
            output += 'Difference - ' + diffPercent + '% - ' + diffCount.toLocaleString('us')

            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                response_type: "in_channel",
                text: output,
            }));
        }
    );
}
