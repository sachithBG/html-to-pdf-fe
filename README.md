# html-to-pdf-fe
pdf generation panel

# Serve
git clone https://github.com/sachithBG/html-to-pdf-fe.git
sudo apt-get install unzip
unzip out.zip
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v

sudo npm install -g pm2
pm2 start "npx serve out" --name "pdf-craft-fe" 
    or pm2 start "npx serve out"

pm2 save
pm2 startup
pm2 monit

