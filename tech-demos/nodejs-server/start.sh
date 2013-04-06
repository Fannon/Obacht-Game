# Evtl: sudo chmod +x start.sh
echo ''
echo '###########################'
echo '# Forever: Starte Server ##'
echo '###########################'
forever stop server.js
forever -o ~/.forever/out.log -e ~/.forever/err.log --append start server.js
echo 'Laufende Forever Prozesse:'
forever list
