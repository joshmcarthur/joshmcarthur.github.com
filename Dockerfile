FROM ruby:2.3-slim
RUN apt-get update && apt-get install -y nodejs nodejs-legacy build-essential
RUN mkdir /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN bundle install -j4
EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--incremental", "--host=0.0.0.0"]
