
CHROME ?= /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
EXT_KEY ?= extension.pem
WEBPACK ?= ./node_modules/.bin/webpack

build:
	@mkdir -p chrome
	@$(WEBPACK)

dev:
	@mkdir -p chrome
	@$(WEBPACK) --watch

extension.crx: build
	@$(CHROME) --pack-extension=$(CURDIR)/extension --pack-extension-key=$(EXT_KEY)

clean:
	@rm -f chrome/background.js* chrome/content.js* chrome/options.js*

.PHONY: clean build
