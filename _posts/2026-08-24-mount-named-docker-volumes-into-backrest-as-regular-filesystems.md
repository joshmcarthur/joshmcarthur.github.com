---
title: Mount named Docker volumes into Backrest as regular filesystems
category: TIL
---

I've been overhauling (see: adding) backups for all the stuff I run in Docker at home. I used [Backrest](https://github.com/garethgeorge/backrest), which uses [restic](https://restic.net/), and it's been a pleasant experience.

The trick I found was to mount named Docker volumes in the docker-compose so they can be backed up as regular filesystems, rather than just wholesale backing up Docker volumes without naming them:

```yaml
version: "3.2"
services:
  backrest:
    image: garethgeorge/backrest:latest
    container_name: backrest
    hostname: backrest
    volumes:
      - /home/deploy/backrest/data:/data
      - /home/deploy/backrest/config:/config
      - /home/deploy/backrest/cache:/cache
      - /home/deploy/backrest/tmp:/tmp
      - /mnt/backups/restic:/repos
      - /var/lib/docker/volumes:/userdata/docker-volumes:ro
      - notes-storage:/userdata/applications/notes/storage:ro
      - photos-storage:/userdata/applications/photos/storage:ro
      - nvr-media:/userdata/services/nvr/media:ro
      - bookmarks-data:/userdata/services/bookmarks/data:ro
      - dashboard-data:/userdata/services/dashboard/data:ro
      - /home/deploy/some-app:/userdata/applications/some-app:ro
    environment:
      - BACKREST_DATA=/data
      - BACKREST_CONFIG=/config/config.json
      - XDG_CACHE_HOME=/cache
      - TMPDIR=/tmp
      - TZ=Pacific/Auckland
    restart: unless-stopped
    ports:
      - 9898:9898

volumes:
  notes-storage:
    external: true
  photos-storage:
    external: true
  nvr-media:
    external: true
  bookmarks-data:
    external: true
  dashboard-data:
    external: true
```

![Backrest dashboard with plans for applications, docker volumes, security media, and services](/img/posts/backrest-dashboard.jpg)

I still need to figure out a way to nicely plug in Postgres dumps. Nearly all my local services use SQLite though, so it's not critical.
