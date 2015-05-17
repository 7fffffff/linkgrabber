watch: clean
	NODE_ENV=development `npm bin`/webpack -w

package: build
	mkdir -p dist
	cp -r css html images js vendor manifest.json dist
	cd dist; zip linkgrabber.zip -x linkgrabber.zip -r .

build: clean
	NODE_ENV=production `npm bin`/webpack -p

lint:
	node_modules/.bin/eslint src

clean:
	rm -rf js
	rm -rf dist
