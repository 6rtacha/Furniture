# ---- Base build image ----
    FROM node:20.10.0 AS builder

    # Set working directory
    WORKDIR /usr/src/furniture
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy all project files and build the NestJS app
    COPY . .
    RUN npm run build
    
    # ---- Production image ----
    FROM node:20.10.0 AS runner
    
    WORKDIR /usr/src/furniture
    
    # Copy only what’s needed for production
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy compiled app from builder
    COPY --from=builder /usr/src/furniture/dist ./dist
    
    # Expose the port your app listens on
    EXPOSE 3007
    
    # Render sets PORT automatically — make sure your Nest app uses it
    ENV PORT=3007
    
    # Start your app
    CMD ["npm", "run", "start:prod"]
    