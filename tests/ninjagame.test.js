require('../js/utility.js');
require('../js/ninjagame.js');
require('../js/ninjaworldbuilder.js');
require('../js/ninjaworld.js');

window = global;


describe('ninjaGame', function() {
    it('can be instantiated', function() {
        let targetMock = {
            addEventListener: jest.fn()
        };

        let elementMock = {
            appendChild: jest.fn(),
            insertAdjacentElement: jest.fn()
        };

        expect(new ninjaGame.NinjaGame(targetMock, elementMock)).toBeTruthy();
    });
});


