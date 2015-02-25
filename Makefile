watch: clean
	`npm bin`/webpack -w

package: build
	mkdir -p dist
	cp -r css html images js vendor manifest.json dist
	cd dist; zip linkgrabber.zip -x linkgrabber.zip -r .

build: clean
	NODE_ENV=production `npm bin`/webpack -p

clean:
	rm -rf js
	rm -rf dist