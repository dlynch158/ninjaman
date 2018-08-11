(function () {
    ninjaGame.NinjaWorld = class {
        constructor(ninjaWorldBuilder, ninjaDiedCallback) {
            this._worldLayout = ninjaWorldBuilder();
            this._charactersPosition = {};
            this._characterCallbacks = {};
            this._worldChangeCallbacks = [];
            this._score = 0;
            this._ninjaDiedCallback = ninjaDiedCallback;
        }

        addCharacter(character, startPosition) {
            this._charactersPosition[character] = startPosition;
        }

        getPositionOfCharacter(character) {
            return this._charactersPosition[character];
        }

        getScore() {
            return this._score;
        }

        getWorldLayout() {
            return this._worldLayout;
        }

        moveCharacter(character, axis, direction) {
            if (!this._charactersPosition[character]) {
                throw `No such character added: ${character}`;
            }

            let requestedMove;
            if (axis === 'horizontal') {
                requestedMove = [
                    this._charactersPosition[character][0],
                    this._charactersPosition[character][1] + direction
                ];
            } else if (axis === 'vertical') {
                requestedMove = [
                    this._charactersPosition[character][0] + direction,
                    this._charactersPosition[character][1]
                ];
            }
            if (this._canMoveTo(...requestedMove)) {
                this._charactersPosition[character] = requestedMove;
                this._characterCallbacks[character](character, axis, direction);
                this._runCollision(character, this._charactersPosition[character]);
            }
        }

        listenWorldChange(callback) {
            this._worldChangeCallbacks.push(callback);
        }

        listenCharacterChange(character, callback) {
            if (this._charactersPosition[character]) {
                this._characterCallbacks[character] = callback;
            } else {
                throw `No such character added: ${character}`;
            }

        }

        _canMoveTo(row, column) {
            switch (this._worldLayout[row][column]) {
                case "sushi":
                    return true;
                case "onigiri":
                    return true;
                case "blank":
                    return true;
                default:
                    return false;
            }
        }

        _runCollision(character, coordinate) {
            if (character === 'ninja') {
                switch (this._worldLayout[coordinate[0]][coordinate[1]]) {
                    case "sushi":
                        this._score += 10;
                        this._worldLayout[coordinate[0]][coordinate[1]] = 'blank';
                        this._worldChanged();
                        break;
                    case "onigiri":
                        this._score += 5;
                        this._worldLayout[coordinate[0]][coordinate[1]] = 'blank';
                        this._worldChanged();
                        break;
                    default:
                        break;
                }
            }

            Object.keys(this._charactersPosition).forEach((gCharacter) => {
               if (gCharacter.substring(0, 5) === 'ghost') {
                   let dead = this._checkDeath(this.getPositionOfCharacter(gCharacter));
                   if (dead) {
                       this._ninjaDied();
                   }
               }
            });
        }

        _checkDeath(ghostPosition) {
            let ninjaPosition = this.getPositionOfCharacter('ninja');
            if (ghostPosition[0] === ninjaPosition[0] && ghostPosition[1] === ninjaPosition[1]) {
                return true;
            }

        }

        _ninjaDied() {
            this._ninjaDiedCallback();
        }

        _worldChanged() {
            for (let i = 0; i < this._worldChangeCallbacks.length; i++) {
                this._worldChangeCallbacks[i](this._worldLayout);
            }
        }
    };

})();