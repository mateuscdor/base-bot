const routinesRun = () => {
  (async () => {})();
  return (req, res, next) => next();
};

module.exports = routinesRun;
