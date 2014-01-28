
CHROME ?= /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
EXT_KEY ?= extension.pem

build: components index.js hyper.chrome.css
	@component build

extension.crx: build extension extension/manifest.json extension/hyper.js extension/hyper.css extension/content.js extension/loader.js
	@$(CHROME) --pack-extension=$(CURDIR)/extension --pack-extension-key=$(EXT_KEY)

extension:
	@mkdir -p $@

extension/manifest.json: manifest.json
	@cp $< $@

extension/hyper.js: build/build.js
	@cp $< $@

extension/hyper.css: build/build.css
	@cp $< $@

extension/content.js: content.js
	@cp $< $@

extension/loader.js: loader.js
	@cp $< $@

components: component.json
	@component install

clean:
	rm -fr build components template.js

.PHONY: clean build
