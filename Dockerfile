# Build stage
FROM node:20-alpine as build

ARG VITE_BOOKING_API_KEY
ARG VITE_BOOKING_API
ARG VITE_CRONJOB_API_KEY
ARG VITE_CRONJOB_API_URL

ENV VITE_BOOKING_API_KEY=$VITE_BOOKING_API_KEY
ENV VITE_BOOKING_API=$VITE_BOOKING_API
ENV VITE_CRONJOB_API_KEY=$VITE_CRONJOB_API_KEY
ENV VITE_CRONJOB_API_URL=$VITE_CRONJOB_API_URL

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

RUN echo "VITE_BOOKING_API=${VITE_BOOKING_API}" > .env && \
    echo "VITE_BOOKING_API_KEY=${VITE_BOOKING_API_KEY}" >> .env && \
    echo "VITE_CRONJOB_API_KEY=${VITE_CRONJOB_API_KEY}" >> .env && \
    echo "VITE_CRONJOB_API_URL=${VITE_CRONJOB_API_URL}" >> .env
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built files from build stage to nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Copy NGINX configuration to the correct directory
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the correct port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]