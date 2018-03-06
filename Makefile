build:
	  docker build . -t joshmcarthur/joshmcarthur.github.io
serve:
	  docker run -v $(shell pwd):/usr/src/app -p4000:4000 joshmcarthur/joshmcarthur.github.io
generate:
	  docker run -v $(shell pwd):/usr/src/app joshmcarthur/joshmcarthur.github.io jekyll build
