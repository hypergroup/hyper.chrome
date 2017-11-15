
CHROME ?= /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
EXT_KEY ?= extension.pem
WEBPACK ?= ./node_modules/.bin/webpack

browser/images:
	@mkdir $@
	@cp images/logo.gif $@/logo.gif

hyper.chrome.zip: build
	@zip -r $@ browser

build: browser/images
	@NODE_ENV=production MIN=1 $(WEBPACK)

dev: browser/images
	@$(WEBPACK) --watch

extension.crx: build
	@$(CHROME) --pack-extension=$(CURDIR)/extension --pack-extension-key=$(EXT_KEY)

clean:
	@rm -rf browser/background.js* browser/content.js* browser/images

.PHONY: clean build
