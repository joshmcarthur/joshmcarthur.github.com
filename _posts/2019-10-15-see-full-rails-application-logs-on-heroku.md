---
layout: post
title: "See full Rails application logs on Heroku"
description: "Heroku suppresses exception logs from your application. Here's how to reenable it."
category: TIL
tags: [til,technology]
---

I recently had an issue on an application that was deployed to Heroku. I could see from the frontend
that I was getting a 500 status code in response to my request, but when I took a look at the Heroku
logs (using `heroku logs`), I saw a single line containing my request, but no other details:

```
2019-10-15T02:47:56.555551+00:00 heroku[router]: at=info method=POST path="/widgets"
host=www.widgets.example.com request_id=c4819835-c2e6-480b-8bd3-4d70725f8bbf fwd="43.255.160.224"
dyno=web.1 connect=0ms service=45ms status=500 bytes=1891 protocol=https
```

This is interesting, because Heroku definitely used to log whatever your Rails app spat out to
STDOUT, but it seems that by default they now suppress some messages - even if your application is
configured with a verbose log level, like my application was set to: `config.log_level = :debug`. 

The solution to this problem came from [this StackOverflow
answer](https://stackoverflow.com/a/22852185) - Heroku has a separate `LOG_LEVEL` environment
variable that can be set to control the verbosity of your process logs. A simple `heroku config:set
LOG_LEVEL=debug`, and I was seeing the stacktrace in my log output:

```
2019-10-15T02:54:43.377469+00:00 app[web.1]: I, [2019-10-15T02:47:56.520678 #4]  INFO -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf] Started POST "/widgets" for 43.255.160.224 at 2019-10-15 02:47:56 +0000
2019-10-15T02:54:43.377471+00:00 app[web.1]: I, [2019-10-15T02:47:56.521691 #4]  INFO -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf] Processing by WidgetsController#create as JS
2019-10-15T02:54:43.377473+00:00 app[web.1]: I, [2019-10-15T02:47:56.521749 #4]  INFO -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   Parameters: {"authenticity_token"=>"Psdasdas=", "widget"=>{"name"=>"Test Widget"}, "commit"=>"Save"}
2019-10-15T02:54:43.377475+00:00 app[web.1]: D, [2019-10-15T02:47:56.526155 #4] DEBUG -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   [1m[36mUser Load (1.2ms)[0m  [1m[34mSELECT "users".* FROM "users" WHERE "users"."id" = $1 ORDER BY "users"."id" ASC LIMIT $2[0m  [["id", 1], ["LIMIT", 1]]
2019-10-15T02:54:43.377478+00:00 app[web.1]: D, [2019-10-15T02:47:56.532972 #4] DEBUG -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   [1m[36mActiveStorage::Blob Load (1.3ms)[0m  [1m[34mSELECT "active_storage_blobs".* FROM "active_storage_blobs" WHERE "active_storage_blobs"."id" = $1 LIMIT $2[0m  [["id", 4], ["LIMIT", 1]]
2019-10-15T02:54:43.377480+00:00 app[web.1]: D, [2019-10-15T02:47:56.548897 #4] DEBUG -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   [1m[35m (1.3ms)[0m  [1m[35mBEGIN[0m
2019-10-15T02:54:43.377482+00:00 app[web.1]: D, [2019-10-15T02:47:56.551282 #4] DEBUG -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   [1m[Widget Create (2.1ms)[0m  [1m[32mINSERT INTO "widgets" ("name", "updated_at", "created_at", "user_id") VALUES ($1, $2, $3, $4) RETURNING "id"[0m  [["name", "Test Widget"], ["updated_at", "2019-10-15 02:47:56.546980"], ["created_at", "2019-10-15 02:47:56.546980"], ["user_id", 1]]
2019-10-15T02:54:43.377484+00:00 app[web.1]: D, [2019-10-15T02:47:56.552428 #4] DEBUG -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   [1m[35m (1.0ms)[0m  [1m[31mROLLBACK[0m
2019-10-15T02:54:43.377486+00:00 app[web.1]: I, [2019-10-15T02:47:56.552765 #4]  INFO -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf] Completed 500 Internal Server Error in 31ms (ActiveRecord: 11.7ms | Allocations: 5871)
2019-10-15T02:54:43.377489+00:00 app[web.1]: F, [2019-10-15T02:47:56.553564 #4] FATAL -- : [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   
2019-10-15T02:54:43.377491+00:00 app[web.1]: [c4819835-c2e6-480b-8bd3-4d70725f8bbf] ActiveRecord::RecordNotUnique (PG::UniqueViolation: ERROR:  duplicate key value violates unique constraint "widgets_pkey"
2019-10-15T02:54:43.377494+00:00 app[web.1]: DETAIL:  Key (id)=(17) already exists.
2019-10-15T02:54:43.377496+00:00 app[web.1]: ):
2019-10-15T02:54:43.377498+00:00 app[web.1]: [c4819835-c2e6-480b-8bd3-4d70725f8bbf]   
2019-10-15T02:54:43.377500+00:00 app[web.1]: [c4819835-c2e6-480b-8bd3-4d70725f8bbf] app/controllers/widgets_controller.rb:21:in `create'
```

 Nice! Once you've got the error
tracked down and resolved, you can either remove this config value entirely, or reduce it to a less
verbose level, like `warn`. 
