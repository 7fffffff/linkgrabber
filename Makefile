watch: clean
	NODE_ENV=development `npm bin`/webpack -w

package: build
	mkdir -p dist
	zip -x\*.DS_Store dist/linkgrabber.zip -r css html images js vendor manifest.json

build: clean
	NODE_ENV=production `npm bin`/webpack

lint:
	node_modules/.bin/eslint src

clean:
	rm -rf js
	rm -rf dist
