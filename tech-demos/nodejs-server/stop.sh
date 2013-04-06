# Evtl: chmod +x stop.sh

echo '###########################'
echo '# Forever: Stoppe Server ##'
echo '###########################'
forever stop server.js
echo 'Laufende Forever Prozesse:'
forever list
