# --- tiny static-site image: ~25 MB ---
FROM nginx:1.27-alpine

# Drop nginx's default welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy only the static site assets (no node_modules, no dotfiles)
COPY index.html        /usr/share/nginx/html/index.html
COPY css/              /usr/share/nginx/html/css/
COPY js/               /usr/share/nginx/html/js/
COPY pages/            /usr/share/nginx/html/pages/

# Custom nginx config (sets correct MIME for .js modules + gzip)
COPY nginx.conf        /etc/nginx/conf.d/default.conf

EXPOSE 80

# nginx runs in the foreground for container compatibility
CMD ["nginx", "-g", "daemon off;"]
