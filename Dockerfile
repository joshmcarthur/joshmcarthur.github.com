FROM ruby:2.7
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - &&\
    apt-get update &&\
    apt-get install nodejs
RUN mkdir /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN bundle install -j4
EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--incremental", "--host=0.0.0.0"]
