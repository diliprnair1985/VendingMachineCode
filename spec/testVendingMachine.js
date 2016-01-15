describe("Vending Machine", function() {

  var vendingMachine;

  beforeEach(function() {
    vendingMachine = new VendingMachine();
  });

  describe("Construction", function() {
    it("Displays Insert Coin When Powered Up", function() {
      expect(vendingMachine.display).toEqual("INSERT COIN");
    });

  });

  describe("Inserting Coins", function() {
    it("Displays 0.25 when a Quarter is Entered", function() {
      vendingMachine.insertCoin(Currency.QUARTER);
      expect(vendingMachine.display).toEqual("$0.25");
    });

    it("Displays 0.10 when a Dime is Entered", function() {
      vendingMachine.insertCoin(Currency.DIME);
      expect(vendingMachine.display).toEqual("$0.10");
    });

    it("Displays 0.05 when a Nickel is Entered", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      expect(vendingMachine.display).toEqual("$0.05");
    });

    it("Displays 1.00 when a Dollar is Entered", function() {
      vendingMachine.insertCoin(Currency.DOLLAR);
      expect(vendingMachine.display).toEqual("$1.00");
    });

    it("Displays the added value of multiple coins", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      vendingMachine.insertCoin(Currency.QUARTER);
      expect(vendingMachine.display).toEqual("$0.30");
      vendingMachine.insertCoin(Currency.DIME);
      vendingMachine.insertCoin(Currency.DOLLAR);
      expect(vendingMachine.display).toEqual("$1.40");
    });

    it("Does not accept pennies", function() {
      vendingMachine.insertCoin(Currency.PENNY);
      expect(vendingMachine.coinReturn).toContain(Currency.PENNY);
      expect(vendingMachine.display).toEqual("INSERT COIN");
    });

    it("Does not accept silver dollars", function() {
      vendingMachine.insertCoin(Currency.SILVER_DOLLAR);
      expect(vendingMachine.coinReturn).toContain(Currency.SILVER_DOLLAR);
      expect(vendingMachine.display).toEqual("INSERT COIN");
    });

    it("Does not accept half dollars", function() {
      vendingMachine.insertCoin(Currency.HALF_DOLLAR);
      expect(vendingMachine.coinReturn).toContain(Currency.HALF_DOLLAR);
      expect(vendingMachine.display).toEqual("INSERT COIN");
    });

    it("Does not increment the amount entered when coins it does not accept are entered", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      vendingMachine.insertCoin(Currency.QUARTER);
      vendingMachine.insertCoin(Currency.HALF_DOLLAR);
      vendingMachine.insertCoin(Currency.SILVER_DOLLAR);
      expect(vendingMachine.display).toEqual("$0.30");
    });

    it("Returns multiple unaccepted coins to the coin return", function() {
      vendingMachine.insertCoin(Currency.HALF_DOLLAR);
      vendingMachine.insertCoin(Currency.SILVER_DOLLAR);
      expect(vendingMachine.coinReturn).toContain(Currency.HALF_DOLLAR);
      expect(vendingMachine.coinReturn).toContain(Currency.SILVER_DOLLAR);
    });

  });

  describe("Coin Return", function() {

    it("returns a coin if the return coin button is pressed", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      vendingMachine.returnCoins();
      expect(vendingMachine.coinReturn).toContain(Currency.NICKEL);
      expect(vendingMachine.coinReturn.length).toBe(1);
    });

    it("it updates the display to show no money has been entered after coins are returned", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      vendingMachine.returnCoins();
      expect(vendingMachine.display).toEqual("INSERT COIN");
    });

    it("contains no coins if the return coin button is pressed", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      vendingMachine.returnCoins();
      expect(vendingMachine.coinsAdded.length).toBe(0);
    });

    it("can return multiple coins", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      vendingMachine.insertCoin(Currency.DIME);
      vendingMachine.insertCoin(Currency.QUARTER);
      vendingMachine.returnCoins();
      expect(vendingMachine.coinReturn).toContain(Currency.NICKEL);
      expect(vendingMachine.coinReturn).toContain(Currency.DIME);
      expect(vendingMachine.coinReturn).toContain(Currency.QUARTER);
      expect(vendingMachine.coinReturn.length).toBe(3);
    });
  });

  describe("it holds coins sorted by type", function() {

    it("adds a coin to the bin when a valid coin is entered", function() {
      vendingMachine.insertCoin(Currency.NICKEL);
      expect(vendingMachine.cash(Currency.NICKEL)).toBe(1);
    });

    it("adds multiple coins to the same bin when a vlaid coin is entered", function() {
      vendingMachine.insertCoin(Currency.DIME);
      vendingMachine.insertCoin(Currency.DIME);
      expect(vendingMachine.cash(Currency.DIME)).toBe(2);
    });

    it("does not add unaccepted coins to the bin", function() {
      vendingMachine.insertCoin(Currency.HALF_DOLLAR);
      expect(vendingMachine.cash(Currency.HALF_DOLLAR)).toBe(0);
    });
  });

  describe("it holds products sorted by type", function() {

    it("Holds products to be purchased", function() {
      expect(vendingMachine.products.length).toBe(3);
    });

    it("Can have more product added to inventory", function() {
      vendingMachine.addInventory(Eatables.CANDY);
      expect(vendingMachine.getInventory(Eatables.CANDY)).toBe(1);
    });

    it("Can add multiple product to inventory", function() {
      vendingMachine.addInventory(Eatables.CANDY);
      vendingMachine.addInventory(Eatables.CANDY);
      expect(vendingMachine.getInventory(Eatables.CANDY)).toBe(2);
    });

    it("Can add multiple product to inventory, easily", function() {
      vendingMachine.addInventory(Eatables.CHIPS, 10);
      expect(vendingMachine.getInventory(Eatables.CHIPS)).toBe(10);
    });

    it("Can vend items and reduce its inventory", function() {
      vendingMachine.addInventory(Eatables.CHIPS, 10);
      vendingMachine.vend(Eatables.CHIPS);
      expect(vendingMachine.getInventory(Eatables.CHIPS)).toBe(9);
    });

    it("Can vend items and place the item in the item bin", function() {
      vendingMachine.addInventory(Eatables.CHIPS, 10);
      vendingMachine.vend(Eatables.CHIPS);
      expect(vendingMachine.itemBin).toContain(Eatables.CHIPS);
    });

  });
  
  describe("it allows a user to purchase an item and retrieve it from the bin", function() {
    
    beforeEach(function(){
      vendingMachine.addInventory(Eatables.CHIPS, 10);
      vendingMachine.addInventory(Eatables.SODA, 1);
      vendingMachine.addInventory(Eatables.CANDY, 10);
    });    
    
    it("Allows a user to buy a product using exact change", function() {
      vendingMachine.insertCoin(Currency.DOLLAR);
      vendingMachine.insertCoin(Currency.QUARTER);
      vendingMachine.vend(Eatables.SODA);
      expect(vendingMachine.itemBin).toContain(Eatables.SODA);
      expect(vendingMachine.display).toBe("INSERT COIN");
    });
  });


});