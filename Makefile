init:
	npm install

build: init
	npm run build

push: build
	npm run push