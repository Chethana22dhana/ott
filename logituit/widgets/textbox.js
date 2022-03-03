define('logituit/widgets/textbox',
  [
    'antie/widgets/widget', 'antie/events/selectevent',
    'antie/devices/sanitiser'
  ],
  function (Widget, SelectEvent, Sanitiser) {
    'use strict'

    var Textbox = Widget.extend(
      {
        init: function (id, text, enableHTML, inputType, pattern,
          placeHolder) {
          // The current API states that if only one parameter
          // is passed to
          // use that value as the text and auto generate an
          // internal id
          if (arguments.length === 1) {
            this._text = id
            this.init.base.call(this)
          } else {
            this._text = text
            this.init.base.call(this, id)
          }
          this._truncationMode = Textbox.TRUNCATION_MODE_NONE
          this._maxLines = 0
          this._enableHTML = enableHTML || false
          this.inputType = inputType || false
          this.pattern = pattern || false
          this._width = 0
          this._placeholder = placeHolder || ''
          this.addClass('textbox')
        },
        render: function (device) {
          var s = this.getTextAsRendered(device)

          if (!this.outputElement) {
            this.outputElement = this.createTextbox(this.id, this
              .getClasses(), s, this._enableHTML, this.inputType,
            this.pattern)
          } else {
            device.setElementContent(this.outputElement, s,
              this._enableHTML, this.inputType, this.pattern)
          }

          return this.outputElement
        },
        _createElement: function (tagName, id, classNames, type) {
          var el = document.createElement(tagName)
          if (tagName === 'input') {
            el.setAttribute('type', type)
          }
          // don't add auto-generated IDs to the DOM
          if (id && (id.substring(0, 1) !== '#')) {
            el.id = id
          }
          if (classNames && (classNames.length > 0)) {
            el.className = classNames.join(' ')
          }
          el.disabled = 'true'// To disable direct input from external TV keyboard
          return el
        },

        createTextbox: function (id, classNames, text, enableHTML, type) {
          var el1 = this
            ._createElement('input', id, classNames, type)
          el1.placeholder = this._placeholder
          this.setElementContent(el1, text, enableHTML)
          return el1
        },
        setElementContent: function (el, content, enableHTML) {
          if (content === '') {
            this.clearElement(el)
            return
          }

          var sanitiser = new Sanitiser(content)
          sanitiser.setElementContent(el, enableHTML)
        },

        clearElement: function (el) {
          for (var i = el.childNodes.length - 1; i >= 0; i--) {
            el.removeChild(el.childNodes[i])
          }
        },

        select: function () {
          this.bubbleEvent(new SelectEvent(this))
        },

        focus: function (force) {
          var origDisabled = this._disabled
          if (force) {
            this._disabled = false
          }

          var focusChanged = true
          var w = this
          while (w.parentWidget) {
            if (!w.parentWidget.setActiveChildWidget(w)) {
              focusChanged = false
            }
            w = w.parentWidget
          }

          this._disabled = origDisabled

          return focusChanged
        },
        getTextAsRendered: function (device) {
          var s
          if (this._width &&
                      this._maxLines &&
                      this._text &&
                      (this._truncationMode === Textbox.TRUNCATION_MODE_RIGHT_ELLIPSIS)) {
            var h = device.getTextHeight('fW', this._width, this
              .getClasses())
            var allowedHeight = h * this._maxLines
            var currentHeight = device.getTextHeight(this._text,
              this._width, this.getClasses())

            var len = this._text.length
            while (currentHeight > allowedHeight && len > 1) {
              len = Math.floor((len * allowedHeight) /
                              currentHeight)
              currentHeight = device.getTextHeight(this._text
                .substring(0, len) +
                              '...', this._width, this.getClasses())
            }
            while (currentHeight <= allowedHeight &&
                          len <= this._text.length) {
              len++
              currentHeight = device.getTextHeight(this._text
                .substring(0, len) +
                              '...', this._width, this.getClasses())
            }
            len--

            if (len < this._text.length) {
              // truncate at word boundary
              var boundaryLen = len
              while (boundaryLen && !/\w\W$/.test(this._text.substring(0, boundaryLen + 1))) {
                boundaryLen--
              }
              if (boundaryLen > 0) {
                s = this._text.substring(0, boundaryLen) +
                                  '...'
              } else {
                s = this._text.substring(0, len) + '...'
              }
            } else {
              s = this._text
            }
          } else {
            s = this._text
          }
          return s
        },

        setText: function (text) {
          this._text = text
          if (this.outputElement) {
            this.outputElement.value = text

            this.render(this.getCurrentApplication().getDevice())
          }
        },

        checked: function (checkboxstatus) {
          if (checkboxstatus) {
            this.outputElement.checked = true
          } else {
            this.outputElement.checked = false
          }
        },

        isChecked: function () {
          return this.outputElement.checked
        },

        getText: function () {
          return this._text
        },
        setTruncationMode: function (mode) {
          this._truncationMode = mode
        },
        setMaximumLines: function (lines) {
          this._maxLines = lines
        },
        setWidth: function (width) {
          this._width = width
        }
      })
    Textbox.TRUNCATION_MODE_NONE = 0
    Textbox.TRUNCATION_MODE_RIGHT_ELLIPSIS = 1
    return Textbox
  })
