---
layout: post
title: "Migrate on push with Heroku releases"
description: "TIL it's quite easy to run migrations whenever you push to Heroku"
category: TIL
tags: [til,technology]
---

I use Heroku for most of my hosting, and also use it a lot in my work at [Rabid Technologies](https://www.rabidtech.co.nz). Something I frequently run into is a migration not being run after a `git push heroku master`, often causing an embarrasing application error page until someone can get to running `heroku run rake db:migrate`. 

Fortunately, Heroku supports [release commands](https://devcenter.heroku.com/articles/release-phase). These commands are run after each successful deployment, and also delay the restart of the dyno(s). This allows for any post-code-update steps to be taken before the application is updated for users. 

Declaring release commands is very simple - a line simply needs to be added to the `Procfile` stating which commands should be run upon release. For example, this is the line I use to run migrations:

```
# Procfile
# ...
# release: bundle exec rake db:migrate
```


Adding this to your Procfile will change your post-receive hook output from Heroku slightly, as it will now output the status of the release command:

```
remote: -----> Launching...        
remote:  !     Release command declared: this new release will not be available until the command succeeds.        
remote:        Released v160        
remote:        https://myapp.herokuapp.com/ deployed to Heroku        
remote: 
remote: Verifying deploy... done.        
remote: Running release command....
remote: 
remote:    (0.6ms)  SELECT pg_try_advisory_lock(7931432920140052365)        
remote:    (1.2ms)  SELECT "schema_migrations"."version" FROM "schema_migrations" ORDER BY "schema_migrations"."version" ASC        
remote:   ActiveRecord::InternalMetadata Load (0.7ms)  SELECT  "ar_internal_metadata".* FROM "ar_internal_metadata" WHERE "ar_internal_metadata"."key" = $1 LIMIT $2  [["key", "environment"], ["LIMIT", 1]]        
remote:    (0.7ms)  BEGIN        
remote:    (0.5ms)  COMMIT        
remote:    (0.9ms)  SELECT pg_advisory_unlock(7931432920140052365)        
remote: Waiting for release.... done. 
```

I find that this functionality is particularly useful for continuous deployment setup, as it only requires `git` to be installed to perform a Heroku deployment AND automatically run migrations. Without this functionality, it is slightly harder, as the deploy needs to happen in two steps - one to do the `git push`, and then another to do the `heroku run`. This process also requires the Heroku CLI to be installed and authenticated, which isn't always the easiest thing in CI environments.
