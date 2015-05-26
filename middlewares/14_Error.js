module.exports = function(err, req, res, next) {

  logger.error(err.stack);

  res.format({
    html : function() {
      if (err.name && err.name === 'NotFoundError') {
        return res.status(404).render('shared/404.html', {message : err.message});
      }

      res.status(500);
      res.render('shared/500.html', {layout : false, error : err.stack})
    },
    json : function() {
      if (err.name && err.name === 'NotFoundError') {
        return res.status(404).json({error : err.message});
      }

      res.status(500);
      res.json({error : err.stack})
    }
  })

}
