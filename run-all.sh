#!/bin/bash
cd app/data
http-server -c1 --cors . &
cd ../../
npm run dev