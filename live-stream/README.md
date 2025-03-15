## How to run

1. Install Docker
2. `docker-compose build`
3. `docker-compose up`
4. Open OBS and in settings set the server to `rtmp://localhost:1935/live` and the stream key to `test?key=supersecret`

    **IF YOU STREAM KEY IS DIFFERENT THAN "TEST" YOU WILL HAVE TO CHANGE THE INDEX.HTML FILE SO THAT IT LOOKS FOR {other-stream-key}.m3u8} (line 17)**
6. Open a browser and go to `http://localhost:8080` to view your live stream!



RTMP Server (cổng 1935) nhận luồng trực tiếp từ OBS, FFmpeg,....
HLS Server chuyển đổi luồng RTMP thành các đoạn .ts và .m3u8 để phát qua HTTP.
HTTP Server (cổng 8080) phục vụ luồng HLS cho trình duyệt hoặc trình phát video.
Xác thực RTMP trước khi cho phép stream lên server.
Hỗ trợ CORS để có thể phát trên các domain khác nhau
