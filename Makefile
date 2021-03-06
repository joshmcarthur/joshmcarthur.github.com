build:
	  docker build . -t joshmcarthur/joshmcarthur.github.io
serve:
		docker run -v $(shell pwd):/usr/src/app:cached -p4000:4000 joshmcarthur/joshmcarthur.github.io 
generate:
	  docker run -v $(shell pwd):/usr/src/app joshmcarthur/joshmcarthur.github.io jekyll build
post:
		docker run --rm -it -v $(shell pwd):/usr/src/app joshmcarthur/joshmcarthur.github.io rake post title="$(title)"
	 
photos:
		$(shell /bin/generatePhotosYaml.sh)
