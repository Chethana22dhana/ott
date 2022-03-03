define(
    'logituit/widgets/keyboard',
    [
        'antie/widgets/keyboard',
        'antie/events/keyevent',
        'antie/events/textchangeevent',
        "logituit/libs/util",
    ],
    function(Keyboard, KeyEvent, TextChangeEvent, Utils) {
        'use strict';
        var Keyboard = Keyboard.extend({
            init: function init (id, cols, rows, keys, horizontalWrapping, verticalWrapping) {
                init.base.call(this, id, cols, rows, keys, horizontalWrapping, verticalWrapping);
                this.utils = new Utils();
            },
            _onKeyDownHandler: function _onKeyDownHandler (evt) {
                if(evt.keyCode === 8 && this.utils.isTizen()) {
                    evt.keyChar = 'Delete';
                }

                if(evt.keyChar) {
                    evt.stopPropagation();
                    // If the device supports multitap, multitap is enabled and a number is pressed...
                    if(this._multitapConfig && this._multiTap && /[0-9]/.test(evt.keyChar)) {
                        var atMaxLength = ((this._maximumLength !== null) && (this._currentText.length >= this._maximumLength));

                        if(this._multiTapTimeout) {
                            clearTimeout(this._multiTapTimeout);
                        }

                        var chars = this._multitapConfig[evt.keyChar];
                        if((evt.keyChar === this._multiTapLastKey) && this._multiTapTimeout) {
                            this._currentText = this._currentText.substring(0, this._currentText.length - 1);
                        } else if (atMaxLength){
                            //at last character and trying to start a new multitap key
                            return;
                        } else {
                            this._multiTapLastKeyIndex = -1;
                        }

                        // Find the next character for the pressed key that's available on this keyboard
                        do {
                            this._multiTapLastKeyIndex++;
                            if(this._multiTapLastKeyIndex >= chars.length) {
                                this._multiTapLastKeyIndex = 0;
                            }
                        } while(!this._letterButtons[chars[this._multiTapLastKeyIndex]]);

                        this._focussedCharacter = chars[this._multiTapLastKeyIndex];
                        this._letterButtons[chars[this._multiTapLastKeyIndex]].focus();
                        this._appendCharacter(chars[this._multiTapLastKeyIndex]);

                        this._multiTapLastKey = evt.keyChar;

                        this._updateClasses();

                        // Fire a text change event, but notify listeners that it may change due to being multitap
                        this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, true));
                        var self = this;
                        this._multiTapTimeout = setTimeout(function() {
                            self._multiTapTimeout = null;
                            // Fire a new text change event to notify listeners that the multi-tap timeout has finished
                            self.bubbleEvent(new TextChangeEvent(this, self._currentText, null, false));
                        }, 1000);
                    } else {
                        // Select and focus the button on the keyboard for the pressed key
                        if(evt.keyCode === 32) {
                            evt.keyChar = 'Space';
                        }
                        var button = this._letterButtons[evt.keyChar];
                        if(button) {
                            this._focussedCharacter = evt.keyChar;
                            button.focus();
                            button.select();
                        } else {
                            button = this._letterButtons[evt.keyChar.toLowerCase()];
                            if(button) {
                                this._focussedCharacter = evt.keyChar.toLowerCase();
                                evt.keyChar = evt.keyChar.toLowerCase();
                                button.focus();
                                button.select();
                            }
                            
                        }
                    }
                } else if(evt.keyCode === KeyEvent.VK_BACK_SPACE) {
                    if(this._currentText.length > 0) {
                        this._currentText = this._currentText.substring(0, this._currentText.length - 1);
                        this._correctTitleCase();

                        this._updateClasses();

                        this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, false));
                    }
                } else if(evt.keyCode === KeyEvent.VK_RIGHT) {
                    if(this._multiTapTimeout) {
                        this._multiTapTimeout = null;
                        // Fire a new text change event to notify listeners that the multi-tap timeout has finished
                        this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, false));
                        evt.stopPropagation();
                    }
                }
            }
        });

        return Keyboard;
    }
);
