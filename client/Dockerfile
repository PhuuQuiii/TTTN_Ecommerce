FROM node:16-alpine

WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies, bao gồm react-icons
RUN npm install
RUN npm install --save react-icons

# Sao chép mã nguồn vào container
COPY . .

# Tạo build production
RUN npm run sass-build
RUN npm run build

# Mở cổng 3002
EXPOSE 3002

# Khởi động ứng dụng
CMD ["npm", "run", "start"] 