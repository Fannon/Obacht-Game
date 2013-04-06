# Evtl: chmod +x start.sh

echo '###########################'
echo '# Forever: Starte Server ##'
echo '###########################'
forever -o ~/.forever/out.log -e ~/.forever/err.log --append start server.js
echo ''
forever list
