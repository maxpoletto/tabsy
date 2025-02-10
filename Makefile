all: chrome firefox

FILES_COMMON=src/background.js src/icon48.png
MANIFEST_CHROME=src/manifest.chrome.json
MANIFEST_FIREFOX=src/manifest.firefox.json

chrome: $(FILES_COMMON) $(MANIFEST_CHROME)
	mkdir -p dist/chrome
	rm -f dist/chrome/*
	cp $(FILES_COMMON) dist/chrome
	cp $(MANIFEST_CHROME) dist/chrome/manifest.json
	cd dist/chrome && zip -r ../chrome.zip .

firefox: $(FILES_COMMON) $(MANIFEST_FIREFOX)
	mkdir -p dist/firefox
	rm -f dist/firefox/*
	cp $(FILES_COMMON) dist/firefox
	cp $(MANIFEST_FIREFOX) dist/firefox/manifest.json
	web-ext build --overwrite-dest --source-dir dist/firefox --artifacts-dir dist

clean:
	rm -rf dist

.PHONY: all chrome firefox clean
