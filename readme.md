#Tests : 
  Contract: GuessAndWin
    ###INITIALISATION
      ✓ verify if owner is msg.sender
      ✓ should not accept to create a contract with hint == word (27237 gas)
      ✓ should not let other user than owner propose a new word (26190 gas)
    ###proposeWord
      ✓ should return true when submiting the right word (99096 gas)
      ✓ should restart mapping when user find the right word (99096 gas)
      ✓ should return false when submiting the wrong word (93070 gas)
      ✓ should revert if user has already try (118137 gas)
      ✓ should revert if user dont pay at least 1 eth to play (25261 gas)
    ###hasSomeoneWin
      ✓ should return true if someone has win (99096 gas)
      ✓ should return false if nobody win (93070 gas)
    ###Money functions
      ✓ seePrize return 3 eth after 3 players paid 1 eth each (245046 gas)
      ✓ should give 3 eth to third after 2 players played and third win (271537 gas)

·----------------------------------------|----------------------------|-------------|----------------------------·
|  Solc version: 0.8.13+commit.abaa5c0e  ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
·········································|····························|·············|·····························
|  Methods                               ·                1 gwei/gas                ·      2970.80 eur/eth       │
·····················|···················|·············|··············|·············|··············|··············
|  Contract          ·  Method           ·  Min        ·  Max         ·  Avg        ·  # calls     ·  eur (avg)  │
·····················|···················|·············|··············|·············|··············|··············
|  GuessAndWin       ·  proposeWord      ·      75982  ·      102473  ·      91805  ·          18  ·       0.27  │
·····················|···················|·············|··············|·············|··············|··············
|  Deployments                           ·                                          ·  % of limit  ·             │
·········································|·············|··············|·············|··············|··············
|  GuessAndWin                           ·          -  ·           -  ·    1351322  ·      20.1 %  ·       4.01  │
·----------------------------------------|-------------|--------------|-------------|--------------|-------------·

  12 passing (7s)