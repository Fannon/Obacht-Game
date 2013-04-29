#!/bin/bash
# Evtl: sudo chmod +x start
# This Script uses https://github.com/nodejitsu/forever for
# Forever should be installed globally (npm install forever -g)

echo ''
echo ''
echo '##################################################'
echo '# Obacht Multiplayer Game Server                 #'
echo '# 2013 Team obacht                               #'
echo '##################################################'
echo '# Starting and monitoring with "Forever" Module  #'
echo '# Output Log: ~/.forever/obacht-out.log          #'
echo '# Error Log:  ~/.forever/obacht-err.log          #'
echo '##################################################'
echo ''
echo ''
echo '#################################'
echo '# Forever: Stop old Process     #'
echo '#################################'
echo ''

forever stop obacht-server.js

echo ''
echo '#################################'
echo '# Forever: Start new Process    #'
echo '#################################'
echo ''

forever -o ~/.forever/obacht-out.log -e ~/.forever/obacht-err.log --append start obacht-server.js

echo ''
echo '#################################'
echo '# Forever: Current Processes:   #'
echo '#################################'
echo ''

forever list
