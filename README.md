# Deployment

## build
### Production
```bash
ng build --configuration production
```

### Staging
```bash
ng build --configuration staging
```

## build docker image
### Production
```bash
docker build -t edims_web_prod:230540 . --build-arg CONFIG=production
```

### Staging
```bash
docker build -t edims_web_staging:230540 . --build-arg CONFIG=staging
```



## Test run

```bash
docker build -t edims-web .
```

```bash
docker build -t edims-web:staging .
```

```bash
sudo docker load -i edims-web.tar
```

## Export/Import image

```bash
docker save -o edims-web.tar edims-web
```

### Production server

Without mount volume

```bash
sudo docker run -it -p 8081:80 --name edims-web-prod edims-web
```

With mount volume

```bash
sudo docker run -it --rm -v /home/administrator/web_server/conf/nginx.conf:/etc/nginx/nginx.conf:ro -p 80:80 --name web_and_proxy nt_web_server
```

### Local server

```bash
docker run -it --rm -v %cd%\nginx\nginx.conf:/etc/nginx/nginx.conf:ro -p 443:443 --name web_and_proxy nt_web_server
```

```bash
docker run -it -v %cd%\nginx\nginx.conf:/etc/nginx/nginx.conf:ro -v %cd%\nginx\linkflow:/etc/nginx/conf.d/linkflow -v %cd%\nginx\infitel:/etc/nginx/conf.d/infitel -p 443:443 --name web_and_proxy nt_web_server
```

```bash
docker run -it --rm -p 443:443 --name web_and_proxy nt_web_server
```

## Production run

```bash
sudo docker run -it -v /home/administrator/web_server/conf/nginx.conf:/etc/nginx/nginx.conf:ro -p 80:80 --name web_and_proxy nt_web_server
```

```bash
docker run -it -v %cd%\nginx\nginx.conf:/etc/nginx/nginx.conf:ro -v %cd%\nginx\linkflow:/etc/nginx/conf.d/linkflow -v %cd%\nginx\infitel:/etc/nginx/conf.d/infitel -p 443:443 --name web_and_proxy nt_web_server
```
