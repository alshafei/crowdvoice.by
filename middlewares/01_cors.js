// *************************************************************************
//                             CORS
// *************************************************************************

var middleware;

if (CONFIG.env === 'test') {
  middleware = function (req, res, next) {
    next();
  }
} else {
  middleware = function(req, res, next) {
    if (fs.existsSync(path.join(process.cwd(), '/public/maintenance'))) {
      return res.status(503).render('shared/503.html', { layout : 'systemStatus', message : 'Under maintenance. <br /> Will be right back!' });
    }

    var hrtime = function() {
      var hrTime = process.hrtime();
      return (hrTime[0] + (hrTime[1] / 1000000));
    }

    var startTime = hrtime();
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.on('finish', function() {
      logger.log('RESPONSE TIME: ' + ((hrtime() - startTime).toFixed(4) + 'ms' + "\n"));

    })
    next();
  };
}

module.exports = middleware;

