window.ninjaGame = {};

(function () {
    ninjaGame.NinjaGame = class {
        constructor(eventTarget, elementToAttachGame) {
            this.gamePageElement = elementToAttachGame;
            this._addEventListeners(eventTarget);
            this.characters = {};

            this.ninjaWorld = new ninjaGame.NinjaWorld(ninjaGame.NinjaWorldBuilder, this._ninjaDied.bind(this));
            ;
            this._addGameCharacters();

            this._addWorldToDOM(this.ninjaWorld.getWorldLayout());
            this._addNinjaToDOM();
            this._addGhostsToDOM();


            this.ninjaWorld.listenWorldChange(this._updateWorld.bind(this));
            this._intervals = [];
            this._setupGhostMovementTimers();
            this._ninjaLives = 3;
        }

        _ninjaDied() {
            if (--this._ninjaLives === 0) {
                this._updateLives();
                this._gameOver();
            } else {
                this._updateLives();
            }
        }

        _updateLives() {
            let newLives = document.createTextNode(this._ninjaLives);
            let lives = document.getElementById('lives');
            lives.replaceChild(newLives, lives.firstChild);
        }
        _gameOver() {
            for (let i = 0; i < this._intervals.length; i++) {
                window.clearInterval(this._intervals[i]);
            }

            Object.keys(this.characters).forEach((character) => {
                this.characters[character].style.setProperty('visibility', 'hidden');

            });

            let gameOver = document.createElement('div');
            let textGameOver = document.createTextNode("GAME OVER!");
            gameOver.appendChild(textGameOver);
            this.gamePageElement.parentNode.replaceChild(gameOver, this.gamePageElement);
        }

        _addGameCharacters() {
            this._addNinja();
            this._addGhosts();
        }

        _addNinja() {
            this.ninjaWorld.addCharacter('ninja', ninjaGame.NinjaStartPosition);
            this.ninjaWorld.listenCharacterChange('ninja', this._characterMoved.bind(this));
        }

        _addGhosts() {
            for (let i = 1; i <= 2; i++) {
                this.ninjaWorld.addCharacter('ghost' + i, ninjaGame.randomStartPosition(this.ninjaWorld));
                this.ninjaWorld.listenCharacterChange('ghost' + i, this._characterMoved.bind(this));
            }
        }

        _setupGhostMovementTimers() {
            for (let i = 1; i <= 2; i++) {
                let intervalId = window.setInterval(this._moveGhost.bind(this, 'ghost' +  i), 1500)
                this._intervals.push(intervalId);
            }
        }

        _moveGhost(ghost) {
            for (let i = 1; i <= 2; i++) {
                let axis = pickRandom('horizontal', 'vertical');
                let direction = parseInt(pickRandom("-1", 1));
                this.ninjaWorld.moveCharacter('ghost' + i, axis, direction);
            }
        }

        _addGhostsToDOM() {
            for (let i = 1; i <= 2; i++) {
                let ghost = document.createElement('div');
                ghost.setAttribute('id', pickRandom('bluey', 'pumpky', 'pinky', 'red'));
                let ghostPosition = this.ninjaWorld.getPositionOfCharacter('ghost' + i);
                let topPx = ghostPosition[0] * 40 + 'px';
                let leftPx = ghostPosition[1] * 40 + 'px';
                ghost.style.setProperty('top', topPx);
                ghost.style.setProperty('left', leftPx);
                this.gamePageElement.insertAdjacentElement('afterend', ghost);
                this.characters['ghost' + i] = ghost;
            }
        }


        _addNinjaToDOM() {
            let ninja = document.createElement('div');
            ninja.setAttribute('id', 'ninjaman');
            this.gamePageElement.insertAdjacentElement('afterend', ninja);
            this.characters['ninja'] = ninja;
        }

        _updateWorld(worldLayout) {
            this._updateScore();
            this._updateDOM(worldLayout);
        }

        _updateScore() {
            let newScore = document.createTextNode(this.ninjaWorld.getScore());
            let score = document.getElementById('current-score');
            score.replaceChild(newScore, score.firstChild);
        }

        _updateDOM(worldLayout) {
            this._addWorldToDOM(worldLayout);
        }

        _characterMoved(character, axis, direction) {
           if (axis === 'horizontal') {
               let oldHorizontal = parseInt(window.getComputedStyle(this.characters[character]).left);
               let pixels = (direction > 0 ? oldHorizontal + 40 : oldHorizontal - 40) + 'px';
               this.characters[character].style.setProperty('left', pixels);
           } else if (axis === 'vertical') {
                let oldVertical = parseInt(window.getComputedStyle(this.characters[character]).top);
                let pixels = (direction > 0 ? oldVertical + 40 : oldVertical - 40) + 'px';
                this.characters[character].style.setProperty('top', pixels);
           }
        }

        _addWorldToDOM(worldLayout) {
            let docFrag = this._buildDocumentFragmentFromData(worldLayout)

            if (this.gamePageElement.firstChild) {
                let regeneratedWorld = document.createElement('div');
                regeneratedWorld.setAttribute('id', 'world');
                regeneratedWorld.appendChild(docFrag);
                this.gamePageElement.parentNode.replaceChild(regeneratedWorld, this.gamePageElement);
                this.gamePageElement = document.getElementById('world');
            } else {
                this.gamePageElement.appendChild(docFrag);
            }
        }

        _buildDocumentFragmentFromData(data) {
            let worldDocumentFragment = document.createDocumentFragment();
            let rows = [];
            for (let i = 0; i < data.length; i++) {
                rows.push(this._createWorldElementsForRow(data[i]));
            }

            for (let i = 0; i < rows.length; i++) {
                let row = document.createElement('div');
                for (let n = 0; n < rows[i].length; n++) {
                    row.classList.add('row');
                    row.appendChild(rows[i][n]);
                }
                worldDocumentFragment.appendChild(row);
            }

            return worldDocumentFragment;
        }

        _createWorldElementsForRow(data) {
            let rowElements = [];
            for (let i = 0; i < data.length; i++) {
                let element = document.createElement('div');
                element.classList.add(data[i]);
                rowElements.push(element);
            }

            return rowElements;
        }

        _addEventListeners(target) {
            let that = this;
            target.addEventListener('keydown', function (event) {
                switch (event.key) {
                    case "ArrowUp":
                        that.ninjaWorld.moveCharacter("ninja", "vertical", -1);
                        break;
                    case "ArrowDown":
                        that.ninjaWorld.moveCharacter("ninja", "vertical", 1);
                        break;
                    case "ArrowLeft":
                        that.ninjaWorld.moveCharacter("ninja", "horizontal", -1);
                        break;
                    case "ArrowRight":
                        that.ninjaWorld.moveCharacter("ninja", "horizontal", 1);
                        break;
                }
            });
        }
    };

    window.addEventListener("load", main);

    function main() {
        let myNinjaGame = new ninjaGame.NinjaGame(document.documentElement, document.getElementById('world'));
    }

})();