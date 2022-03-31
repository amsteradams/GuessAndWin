const GuessAndWin = artifacts.require("GuessAndWin");

module.exports = function (deployer) {
  deployer.deploy(GuessAndWin, 'test test', 'test');
};
